// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event NewEpicNFTMinted(address sender, uint256 tokenId);
    uint16 public mintLimit = 50;

    string[] firstWords = [
        "Political",
        "Woozy",
        "Nutritious",
        "Acidic",
        "Imminent",
        "Wealthy",
        "Doubtful",
        "Faulty",
        "Vivacious",
        "Flaky",
        "Godly",
        "Entire",
        "Romantic",
        "Mindless",
        "Electronic"
    ];
    string[] secondWords = [
        "Realistic",
        "Calculating",
        "Melted",
        "Mean",
        "Impressive",
        "Evanescent",
        "Boundless",
        "Tawdry",
        "Confused",
        "Alive",
        "Furtive",
        "Omniscient",
        "Puffy",
        "Muddled",
        "Educational"
    ];
    string[] thirdWords = [
        "Engine",
        "Session",
        "Music",
        "Engineering",
        "Historian",
        "Worker",
        "Throat",
        "Security",
        "Possession",
        "Goal",
        "Topic",
        "Honey",
        "Girl",
        "Way",
        "Bird"
    ];

    string[] availableColors = ["black", "blue", "green", "red", "purple"];

    // We need to pass the name of our NFTs token and its symbol.
    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("This is my NFT Epic Trips contract. Woah!");
    }

    // A function our user will hit to get their NFT.
    function makeAnEpicNFT() public {
        // Get the current tokenId, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        require(newItemId <= mintLimit, "No more NFTS availables");

        // Actually mint the NFT to the sender using msg.sender.
        _safeMint(msg.sender, newItemId);
        console.log(
            "An NFT w/ ID %d has been minted to %s",
            newItemId,
            msg.sender
        );

        string memory combinedWord = string(
            abi.encodePacked(
                pickRandomFirstWord(newItemId),
                pickRandomSecondWord(newItemId),
                pickRandomThirdWord(newItemId)
            )
        );
        string memory color = pickRandomColor(newItemId);
        string memory finalSVG = getSVG(color, combinedWord);

        string memory json = string(
            abi.encodePacked(
                '{ "name": "',
                combinedWord,
                '", "description": "An NFT from the highly acclaimed square collection", ',
                '"image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSVG)),
                '" }'
            )
        );

        string memory tokenURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );

        console.log("SVG: %s", finalSVG);
        console.log("TokenURI: %s", tokenURI);

        // Set the NFTs data.
        _setTokenURI(newItemId, tokenURI);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();

        emit NewEpicNFTMinted(msg.sender, newItemId);
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256) {
        return _tokenIds.current();
    }

    function pickRandomWord(
        uint256 tokenID,
        string[] memory words,
        string memory seedPhrase
    ) private pure returns (string memory) {
        // seed the random generator
        uint256 rand = random(
            string(abi.encodePacked(seedPhrase, Strings.toString(tokenID)))
        );
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % words.length;
        return words[rand];
    }

    function getSVG(string memory color, string memory phrase)
        private
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='",
                    color,
                    "' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
                    phrase,
                    "</text></svg>"
                )
            );
    }

    function pickRandomColor(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return pickRandomWord(tokenId, availableColors, "COLOR");
    }

    function pickRandomFirstWord(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return pickRandomWord(tokenId, firstWords, "FIRST_WORD");
    }

    function pickRandomSecondWord(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return pickRandomWord(tokenId, secondWords, "SECOND_WORD");
    }

    function pickRandomThirdWord(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return pickRandomWord(tokenId, thirdWords, "THIRD_WORD");
    }

    function random(string memory input) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
}
