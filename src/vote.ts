import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getSigner, handleTransactionResponse, voteMoveCall } from "./helpers";
import { VoteParams } from "./types";

export async function vote({
  contractId,
  voteRequest,
  voterAccount,
  choice,
  packageId,
  network,
}: VoteParams) {
  const { keypair } = getSigner(voterAccount);
  const client = getClient(network);
  const tx = new TransactionBlock();

  voteMoveCall({ tx, packageId, contractId, voteRequest, choice });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  return "success";
}
