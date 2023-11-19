import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse } from "./helpers";
import type { TransferContractStockParams, TransferContractStockResult } from "./types";

/**
 * Transfers an contract stock
 * @returns contract stock id
 */
export async function transferContractStock(
  client: SuiClient,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, contractStockId, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_contract_stock`,
    arguments: [tx.object(contractId), tx.pure(contractStockId), tx.pure(receiverAddress)],
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  handleTransactionResponse(txRes);
  const { digest } = txRes;
  return { digest };
}
