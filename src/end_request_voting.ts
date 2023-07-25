import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";


type EndVoteRequestParams = { 
  packageId: string;
  adminCapId: string;
  voteRequest: string; 
  signerPhrase: string;
}
export async function endRequestVoting({ voteRequest, packageId, signerPhrase, adminCapId }: EndVoteRequestParams) {
  const { signer } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_request_voting`,
    arguments: [tx.object(adminCapId), tx.object(voteRequest)],
  });

  try {
    const txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    return getExecutionStatus(txRes);
  } catch (e) {
    // console.error("Could not end voting request", e);
    throw new Error("Could not end voting request");
  }
}

