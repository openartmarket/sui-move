import { TransactionBlock, getExecutionStatus } from "@mysten/sui.js";
import { getSigner } from "./helpers";
import { adminCap, packageId } from "./config";

export async function endRequestVoting(voteRequest: string) {
  let { signer } = getSigner("admin");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_request_voting`,
    arguments: [tx.object(adminCap), tx.object(voteRequest)],
  });

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("effects", getExecutionStatus(txRes));
  } catch (e) {
    console.error("Could not end voting request", e);
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  endRequestVoting(
    "{voteRequest}"
  );
}