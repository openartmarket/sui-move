import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse, mergeMoveCall } from "./helpers";
import type { MergeContractStockParams } from "./types";

export async function mergeContractStock(
  client: SuiClient,
  params: MergeContractStockParams,
): Promise<void> {
  const { toContractStockId, fromContractStockId, signerPhrase, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  mergeMoveCall({
    tx,
    packageId,
    toContractStockId,
    fromContractStockId,
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  handleTransactionResponse(txRes);
}
