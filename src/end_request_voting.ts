import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { EndVoteRequestParams } from "./types";

export async function endRequestVoting({
  voteRequest,
  packageId,
  signerPhrase,
  adminCapId,
}: EndVoteRequestParams) {
  const { signer } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_request_voting`,
    arguments: [tx.object(adminCapId), tx.object(voteRequest)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);

  return getExecutionStatus(txRes);
}
