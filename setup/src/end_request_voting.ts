import { TransactionBlock, getExecutionStatus } from "@mysten/sui.js";
import { getSigner } from "./helpers";
import { adminCap, packageId } from "./config";

export async function endRequestVoting(voteRequest: string) {
  let signer = getSigner();
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

    console.log("effects", getExecutionStatus(txRes)?.status, txRes.effects);
  } catch (e) {
    console.error("Could not end voting request", e);
  }
}
