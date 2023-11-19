import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { findObjectsWithOwnerAddress } from "./findObjectsWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import type { ContractStockDetails, SplitContractStockParams } from "./types";

export async function splitContractStock(
  client: SuiClient,
  params: SplitContractStockParams,
): Promise<ContractStockDetails> {
  const { contractStockId, signerPhrase, quantity, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const address = keypair.getPublicKey().toSuiAddress();
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [tx.object(contractStockId), tx.pure(quantity)],
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

  const contractStocks = findObjectsWithOwnerAddress(txRes, address);
  if (contractStocks.length !== 1)
    throw new Error(`Expected 1 contract stock, got ${JSON.stringify(contractStocks)}`);
  const newContractStockId = contractStocks[0].objectId;
  return {
    contractStockId: newContractStockId,
  };
}
