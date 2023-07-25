import {
  Connection,
  Ed25519Keypair,
  getExecutionStatus,
  JsonRpcProvider,
  RawSigner,
  SuiTransactionBlockResponse,
} from "@mysten/sui.js";

export function getProvider(SUI_NETWORK: string) {
  const connOptions = new Connection({
    fullnode: SUI_NETWORK,
  });
  return new JsonRpcProvider(connOptions);
}

export function getSigner(
  phrase: string,
  network: string
): {
  signer: RawSigner;
  address: string;
} {
  if (!phrase) throw new Error("No phrase provided");
  const provider = getProvider(network);

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
