import { SuiObjectChangeCreated, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import {
  MergeStockMoveTransactionParams,
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

export function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[] {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created",
  ) as SuiObjectChangeCreated[];
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
  toContractStockId,
  fromContractStockId,
}: MergeStockMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::open_art_market::merge_contract_stocks`,
    arguments: [tx.object(toContractStockId), tx.object(fromContractStockId)],
  });
}
export function splitMoveCall({
  tx,
  packageId,
  contractStockId,
  quantity,
}: SplitStockMoveTransactionParams): void {
  tx.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [tx.object(contractStockId), tx.pure(quantity)],
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
