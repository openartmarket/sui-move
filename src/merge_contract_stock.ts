import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse, mergeMoveCall } from "./helpers";
import { ContractStockDetails, MergeContractStockParams } from "./types";

export async function mergeContractStock(
  client: SuiClient,
  params: MergeContractStockParams,
): Promise<ContractStockDetails> {
  const { contractStock1Id, contractStock2Id, signerPhrase, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  mergeMoveCall({ tx, packageId, contractStock1Id, contractStock2Id });

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
  return {
    contractStockId: contractStock1Id,
    owner: keypair.getPublicKey().toSuiAddress(),
  };
}
