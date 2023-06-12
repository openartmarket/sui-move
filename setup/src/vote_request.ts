import {
  TransactionBlock,
  getCreatedObjects,
  getExecutionStatus,
} from "@mysten/sui.js";
import { packageId, adminCap } from "./config";
import { getSigner } from "./helpers";

export async function createVoteRequest(artwork_id: string, request: string) {
  console.log("Mint artwork shard for: %s", artwork_id);

  let { signer } = getSigner("admin");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::create_vote_request`,
    arguments: [tx.object(adminCap), tx.pure(artwork_id), tx.pure(request)],
  });

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    console.log("effects", getExecutionStatus(txRes));
    let vote_request_id = getCreatedObjects(txRes)?.[0].reference.objectId;
    console.log("vote request id", vote_request_id);
    return vote_request_id;
  } catch (e) {
    console.error("Could not create vote request", e);
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  createVoteRequest(
    "0x3e88c14f87d56779b90429095d5dc30a995e3b4edf27e206366f192275eb4d84",
    "Request to sell artwork to Bob"
  );
}
