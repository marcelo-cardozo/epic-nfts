import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  myEpicNFTContractABI,
  myEpicNFTContractAddress,
} from "../MyEpicNFT/MyEpicNFT.constants";

export function useMyEpicNFTContract() {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setContract(
          new ethers.Contract(
            myEpicNFTContractAddress,
            myEpicNFTContractABI,
            signer
          )
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {}
  }, []);

  return { contract };
}
