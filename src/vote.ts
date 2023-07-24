import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID, USER1_PHRASE } from "./config";
import { getSigner } from "./helpers";

export async function vote(
  artwork: string,
  voteRequest: string,
  voterAccount: string,
  choice: boolean
) {
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
