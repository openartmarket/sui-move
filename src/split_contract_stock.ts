import { TransactionBlock } from "@mysten/sui.js";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import { ContractStockDetails, SplitContractStockParams } from "./types";

export async function splitContractStock(
  params: SplitContractStockParams
): Promise<ContractStockDetails> {
  const { contractStockId, signerPhrase, shares, packageId, network } = params;
  const { signer, address } = getSigner(signerPhrase, network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [tx.object(contractStockId), tx.pure(shares)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });

  handleTransactionResponse(txRes);
  const newContractStockId = findObjectIdWithOwnerAddress(txRes, address);
  return {
    contractStockId: newContractStockId,
    owner: address,
  };
}
