import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect } from "react";
import { useMintMyEpicNFT } from "./hooks/use-mint-myepicnft.hook";
import { useMyEpicNFTContract } from "./hooks/use-myepicnft-contract.hook";
import { myEpicNFTContractAddress } from "./MyEpicNFT/MyEpicNFT.constants";
import { useMintCountLimit } from "./hooks/use-mint-count-limit.hook";
import { useWalletContext } from "./WalletContext";
// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/squarenft-rcweukox97";

const App = () => {
  const { connectWallet, currentAccount } = useWalletContext();
  const { mintNFT, isLoading, isRequestingTransaction } = useMintMyEpicNFT();
  const { contract: epicNFTContract } = useMyEpicNFTContract();
  const {
    mintCount,
    mintLimit,
    refetch,
    isLoading: isLoadingInit,
    isSuccess: isSuccessInit,
  } = useMintCountLimit();

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
    function onNewEpicNFTMinted(from, tokenId) {
      console.log(from, tokenId.toNumber());
      alert(
        `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${myEpicNFTContractAddress}/${tokenId.toNumber()}>`
      );
      refetch();
    }

    if (epicNFTContract) {
      epicNFTContract.on("NewEpicNFTMinted", onNewEpicNFTMinted);
    }
    return () => {
      if (epicNFTContract) {
        epicNFTContract.off("NewEpicNFTMinted", onNewEpicNFTMinted);
      }
    };
  }, [epicNFTContract]);

  const disableMintButton =
    !isSuccessInit || isLoading || isRequestingTransaction;
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
            <>
              {isLoadingInit ? <p className="sub-text">Loading...</p> : null}
              {isSuccessInit ? (
                <p className="sub-text">
                  {mintCount < mintLimit
                    ? `${mintCount}/${mintLimit} NFTs minted so far`
                    : null}
                  {mintCount >= mintLimit ? "No more NFTs availables :(" : null}
                </p>
              ) : null}
              <button
                disabled={disableMintButton}
                onClick={mintNFT}
                className="cta-button connect-wallet-button"
                style={{
                  opacity: disableMintButton ? 0.2 : undefined,
                  marginRight: 16,
                }}
              >
                Mint NFT
              </button>
              {isRequestingTransaction ? (
                <p className="sub-text">Requesting operation...</p>
              ) : null}
              {isLoading ? (
                <p className="sub-text">Mining transaction...</p>
              ) : null}
            </>
          )}
        </div>
        <div className="footer-container">
          <a
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
            className="footer-text"
            style={{ marginRight: 16 }}
          >
            🌊 View Collection on OpenSea
          </a>
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
