import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { BurnContractParams, BurnContractResult } from "./types";

export async function burnContractStock(params: BurnContractParams): Promise<BurnContractResult> {
  const { contractStockId, contractId, packageId, signerPhrase, network } = params;
  const { signer, address } = getSigner(signerPhrase, network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::safe_burn_contract_stock`,
    arguments: [tx.object(contractId), tx.object(contractStockId)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  return {
    contractStockId,
    success: true,
    owner: address,
  };
}
