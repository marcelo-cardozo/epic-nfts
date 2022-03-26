import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

const WalletContext = createContext({});

// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4";

export function WalletContextProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState();

  const connectWallet = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log({ accounts });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log("Make sure you have metamask!");
          setCurrentAccount(null);
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }

        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        if (chainId !== rinkebyChainId) {
          alert("Please connect to the Rinkeby Test Network to use this DAPP!");
        } else {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          console.log({ accounts });

          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
          } else {
            console.log("No authorized account found");
            setCurrentAccount(null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  return (
    <WalletContext.Provider
      value={useMemo(
        () => ({ connectWallet, currentAccount }),
        [connectWallet, currentAccount]
      )}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("Component must be a child from WalletContextProvider");
  }
  return context;
}
