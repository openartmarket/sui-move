import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { adminCap, adminPhrase, packageId } from "./config";
import { getSigner } from "./helpers";

export async function createVoteRequest(artwork_id: string, request: string) {
  // console.log("Mint artwork shard for: %s", artwork_id);

  const { signer } = getSigner(adminPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::create_vote_request`,
    arguments: [tx.object(adminCap), tx.pure(artwork_id), tx.pure(request)],
  });

  try {
    const txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    // console.log("effects", getExecutionStatus(txRes));
    const vote_request_id = getCreatedObjects(txRes)?.[0].reference.objectId;
    // console.log("vote request id", vote_request_id);
    return vote_request_id;
  } catch (e) {
    // console.error("Could not create vote request", e);
    throw new Error("Could not create vote request");
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  createVoteRequest(
    "0x3e88c14f87d56779b90429095d5dc30a995e3b4edf27e206366f192275eb4d84",
    "Request to sell artwork to Bob"
  );
}
