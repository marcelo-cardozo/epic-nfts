import { useCallback, useEffect, useState } from "react";
import { useWalletContext } from "../WalletContext";
import { useMyEpicNFTContract } from "./use-myepicnft-contract.hook";

export function useMintCountLimit() {
  const [status, setStatus] = useState("idle");
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [mintLimit, setMintLimit] = useState();
  const [mintCount, setMintCount] = useState();
  const { contract: epicNFTContract } = useMyEpicNFTContract();
  const { currentAccount } = useWalletContext();

  useEffect(() => {
    async function loadValues() {
      setStatus("loading");
      const [countResponse, limitResponse] = await Promise.allSettled([
        epicNFTContract.getTotalNFTsMintedSoFar(),
        epicNFTContract.mintLimit(),
      ]);
      console.log({ countResponse, limitResponse });
      setMintCount(countResponse.value.toNumber());
      setMintLimit(limitResponse.value.toNumber());
      setStatus("success");
    }

    if (epicNFTContract && currentAccount) {
      loadValues();
    }
  }, [epicNFTContract, currentAccount, refetchFlag]);

  return {
    mintCount,
    mintLimit,
    refetch: useCallback(() => {
      setRefetchFlag((prev) => !prev);
    }, []),
    isLoading: status === "loading",
    isSuccess: status === "success",
  };
}
