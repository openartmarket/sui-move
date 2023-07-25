import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { ContractStockDetails, MergeContractStockParams } from "./types";

export async function mergeContractStock(
  params: MergeContractStockParams
): Promise<ContractStockDetails> {
  const { contractStock1Id, contractStock2Id, signerPhrase, packageId, network } = params;
  const { signer, address } = getSigner(signerPhrase, network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::merge_contract_stocks`,
    arguments: [tx.object(contractStock1Id), tx.object(contractStock2Id)],
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
    contractStockId: contractStock1Id,
    owner: address,
  };
}
