import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner, handleTransactionResponse, splitMoveCall } from "./helpers";
import { ContractStockDetails, SplitContractStockParams } from "./types";

export async function splitContractStock(
  client: SuiClient,
  params: SplitContractStockParams,
): Promise<ContractStockDetails> {
  const { contractStockId, signerPhrase, quantity, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const address = keypair.getPublicKey().toSuiAddress();
  const tx = new TransactionBlock();

  splitMoveCall({ tx, packageId, contractStockId, quantity });
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

  const newContractStockId = findObjectIdWithOwnerAddress(txRes, address);
  return {
    contractStockId: newContractStockId,
    // owner: address,
  };
}
