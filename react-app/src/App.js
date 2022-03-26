import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect } from "react";
import { useConnectWallet } from "./hooks/use-connect-wallet.hook";
import { useMintMyEpicNFT } from "./hooks/use-mint-myepicnft.hook";
import { useMyEpicNFTContract } from "./hooks/use-myepicnft-contract.hook";
import { myEpicNFTContractAddress } from "./MyEpicNFT/MyEpicNFT.constants";
// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const { connectWallet, currentAccount } = useConnectWallet();
  const { mintNFT } = useMintMyEpicNFT();
  const { contract: epicNFTContract } = useMyEpicNFTContract();

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    if (epicNFTContract) {
      epicNFTContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        alert(
          `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${myEpicNFTContractAddress}/${tokenId.toNumber()}>`
        );
      });
    }
  }, [epicNFTContract]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount == null ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={mintNFT}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
