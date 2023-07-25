import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { TransferContractStockParams, TransferContractStockResult } from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function transferContractStock(
  params: TransferContractStockParams
): Promise<TransferContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, contractStockId, packageId, network } = params;
  const { signer } = getSigner(signerPhrase, network);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_contract_stock`,
    arguments: [tx.object(contractId), tx.pure(contractStockId), tx.pure(receiverAddress)],
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
  const { digest } = txRes;
  return { contractStockId, digest, owner: receiverAddress };
}
