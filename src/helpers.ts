import {
  Connection,
  Ed25519Keypair,
  getExecutionStatus,
  JsonRpcProvider,
  RawSigner,
  SuiTransactionBlockResponse,
} from "@mysten/sui.js";

import { SUI_NETWORK } from "../test/test-helpers";

// console.log("Connecting to ", SUI_NETWORK);
const connOptions = new Connection({
  fullnode: SUI_NETWORK,
});
export const provider = new JsonRpcProvider(connOptions);

export function getSigner(phrase: string): {
  signer: RawSigner;
  address: string;
} {
  if (!phrase) throw new Error("No phrase provided");

  const keypair = Ed25519Keypair.deriveKeypair(phrase);
  const signer = new RawSigner(keypair, provider);

  const address = keypair.getPublicKey().toSuiAddress();
  // console.log("Address = " + address);

  return { signer, address };
}

export function handleTransactionResponse(txRes: SuiTransactionBlockResponse): void {
  const status = getExecutionStatus(txRes);
  if (status === undefined) {
    throw new Error("Failed to get execution status");
  }
  if (status.error) {
    throw new Error(status.error);
  }
  if (status.status !== "success") {
    throw new Error(`Transaction failed with status: ${status.status}`);
  }
}
