import { ethers } from "ethers";
import StagePassABI from "./StagePassABI.json";
import { contractAddress } from "./contractAddress";

export function getStagePassContract(providerOrSigner) {
  if (!contractAddress) {
    throw new Error("Contract address is not set yet.");
  }

  return new ethers.Contract(
    contractAddress,
    StagePassABI,
    providerOrSigner
  );
}