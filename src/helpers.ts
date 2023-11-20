import type { SuiObjectChangeCreated, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

export function getSigner(phrase: string): {
  keypair: Ed25519Keypair;
  address: string;
} {
  if (!phrase) throw new Error("No phrase provided");
  const keypair = Ed25519Keypair.deriveKeypair(phrase);
  const address = keypair.getPublicKey().toSuiAddress();
  return { keypair, address };
}

export function handleTransactionResponse(txRes: SuiTransactionBlockResponse): void {
  const status = getExecutionStatus(txRes);
  if (status !== "success") {
    throw new Error(`Transaction failed with status: ${status}`);
  }
}

function getExecutionStatus(txRes: SuiTransactionBlockResponse): string {
  const status = txRes.effects?.status;
  if (status === undefined) {
    throw new Error("Failed to get execution status");
  }
  if (status.error) {
    throw new Error(status.error);
  }
  return status.status;
}

/*
@deprecated
*/
export function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[] {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created",
  ) as SuiObjectChangeCreated[];
}
