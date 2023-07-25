import { TransactionBlock } from "@mysten/sui.js";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import { MintContractStockParams, MintContractStockResult } from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function mintContractStock(
  params: MintContractStockParams
): Promise<MintContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, packageId, adminCapId, shares, network } =
    params;
  const { signer } = getSigner(signerPhrase, network);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract_stock`,
    arguments: [
      tx.object(adminCapId),
      tx.object(contractId),
      tx.pure(shares),
      tx.pure(receiverAddress),
    ],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  const contractStockId = findObjectIdWithOwnerAddress(txRes, receiverAddress);
  const { digest } = txRes;
  return { contractStockId, digest, owner: receiverAddress };
}