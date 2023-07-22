import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export async function endRequestVoting(voteRequest: string) {
  const { signer } = getSigner(ADMIN_PHRASE);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao::end_request_voting`,
    arguments: [tx.object(ADMIN_CAP_ID), tx.object(voteRequest)],
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

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  endRequestVoting("{voteRequest}");
}
