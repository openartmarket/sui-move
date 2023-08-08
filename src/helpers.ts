import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectChangeCreated,
  SuiTransactionBlockResponse,
} from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import {
  MergeStockMoveTransactionParams,
  NetworkName,
  SplitStockMoveTransactionParams,
  TransferStockMoveTransactionParams,
  VoteMoveTransactionParams,
} from "./types";

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

export function getCreatedObjects(
  txRes: SuiTransactionBlockResponse
): SuiObjectChangeCreated[] | null {
  return txRes.objectChanges?.filter(
    (change) => change.type === "created"
  ) as SuiObjectChangeCreated[];
}

export function getClient(network: NetworkName = "localnet") {
  return new SuiClient({
    url: getFullnodeUrl(network),
  });
}

export function transferMoveCall({
  tx,
  packageId,
  contractId,
  contractStockId,
  receiverAddress,
}: TransferStockMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_contract_stock`,
    arguments: [tx.object(contractId), tx.pure(contractStockId), tx.pure(receiverAddress)],
  });
}
export function mergeMoveCall({
  tx,
  packageId,
  contractStock1Id,
  contractStock2Id,
}: MergeStockMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::open_art_market::merge_contract_stocks`,
    arguments: [tx.object(contractStock1Id), tx.object(contractStock2Id)],
  });
}
export function splitMoveCall({
  tx,
  packageId,
  contractStockId,
  shares,
}: SplitStockMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [tx.object(contractStockId), tx.pure(shares)],
  });
}
export function voteMoveCall({
  tx,
  packageId,
  contractId,
  voteRequest,
  choice,
}: VoteMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::dao::vote`,
    arguments: [tx.object(contractId), tx.object(voteRequest), tx.pure(choice)],
  });
}
