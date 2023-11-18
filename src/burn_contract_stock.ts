import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse } from "./helpers.js";
import type { BurnContractParams } from "./types.js";

export async function burnContractStock(
  client: SuiClient,
  params: BurnContractParams,
): Promise<void> {
  const { contractStockId, contractId, packageId, signerPhrase } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::safe_burn_contract_stock`,
    arguments: [tx.object(contractId), tx.object(contractStockId)],
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
}
