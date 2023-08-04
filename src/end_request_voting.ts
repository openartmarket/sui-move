import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getExecutionStatus, getSigner, handleTransactionResponse } from "./helpers";
import { EndVoteRequestParams } from "./types";

export async function endRequestVoting({
  voteRequest,
  packageId,
  signerPhrase,
  adminCapId,
  network,
}: EndVoteRequestParams) {
  const { keypair } = getSigner(signerPhrase);
  const client = getClient(network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_vote`,
    arguments: [tx.object(adminCapId), tx.object(voteRequest)],
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

  return getExecutionStatus(txRes);
}
