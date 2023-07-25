import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";
type VoteParams = { 
  artwork: string; 
  voteRequest: string; 
  voterAccount: string; 
  choice: boolean; 
}

export async function vote({ artwork, voteRequest, voterAccount, choice }: VoteParams) {
  const { signer } = getSigner(voterAccount);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao::vote`,
    arguments: [tx.object(artwork), tx.object(voteRequest), tx.pure(choice)],
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
    // console.error("Could not vote", e);
    throw new Error("Could not vote");
  }
}
