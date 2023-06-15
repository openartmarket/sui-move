import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { adminCap, adminPhrase, packageId } from "./config";
import { getSigner } from "./helpers";

export async function endRequestVoting(voteRequest: string) {
  const { signer } = getSigner(adminPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_request_voting`,
    arguments: [tx.object(adminCap), tx.object(voteRequest)],
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
  endRequestVoting(
    "{voteRequest}"
  );
}
