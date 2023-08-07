import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getSigner, handleTransactionResponse, transferMoveCall } from "./helpers";
import { TransferContractStockParams, TransferContractStockResult } from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function transferContractStock(
  params: TransferContractStockParams
): Promise<TransferContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, contractStockId, packageId, network } = params;
  const { keypair } = getSigner(signerPhrase);
  const client = getClient(network);
  const tx = new TransactionBlock();

  transferMoveCall({ tx, packageId, contractId, contractStockId, receiverAddress });

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
  return { contractStockId, digest, owner: receiverAddress };
}
