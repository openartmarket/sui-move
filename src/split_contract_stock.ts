import { TransactionBlock } from "@mysten/sui.js/transactions";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getClient, getSigner, handleTransactionResponse, splitMoveCall } from "./helpers";
import { ContractStockDetails, SplitContractStockParams } from "./types";

export async function splitContractStock(
  params: SplitContractStockParams
): Promise<ContractStockDetails> {
  const { contractStockId, signerPhrase, shares, packageId, network } = params;
  const { keypair } = getSigner(signerPhrase);
  const address = keypair.getPublicKey().toSuiAddress();
  const client = getClient(network);
  const tx = new TransactionBlock();

  splitMoveCall({ tx, packageId, contractStockId, shares });
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
    owner: address,
  };
}
