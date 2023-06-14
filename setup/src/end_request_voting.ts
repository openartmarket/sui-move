import { TransactionBlock, getExecutionStatus } from "@mysten/sui.js";
import { getSigner } from "./helpers";
import { adminCap, adminPhrase, packageId } from "./config";

export async function endRequestVoting(voteRequest: string) {
  let { signer } = getSigner(adminPhrase);
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

    return getExecutionStatus(txRes);
  } catch (e) {
    // console.error("Could not end voting request", e);
    throw new Error("Could not end voting request");
  }
}
