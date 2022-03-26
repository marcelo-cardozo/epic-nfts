import { useCallback, useEffect, useRef, useState } from "react";
import { useMyEpicNFTContract } from "./use-myepicnft-contract.hook";

export function useMintMyEpicNFT({ onMined } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingTransaction, setIsRequestingTransaction] = useState(false);
  const { contract: myEpicNFTContract } = useMyEpicNFTContract();
  const onMinedRef = useRef();

  useEffect(() => {
    onMinedRef.current = onMined;
  }, [onMined]);

  const mintNFT = useCallback(async () => {
    if (!myEpicNFTContract) {
      console.log("Ethereum object doesn't exist!");
      return;
    }

    try {
      console.log("Going to pop wallet now to pay gas...");
      setIsRequestingTransaction(true);
      let nftTxn = await myEpicNFTContract.makeAnEpicNFT();
      setIsRequestingTransaction(false);

      setIsLoading(true);
      console.log("Mining...please wait.");
      await nftTxn.wait();
      setIsLoading(false);

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
      );

      if (onMinedRef.current) {
        await onMinedRef.current(myEpicNFTContract);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsRequestingTransaction(false);
    }
  }, [myEpicNFTContract]);

  return { isLoading, isRequestingTransaction, mintNFT };
}
