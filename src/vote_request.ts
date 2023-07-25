import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";

type VoteRequestParams = { 
  artwork_id: string; 
  request: string; 
  packageId: string;
  adminCapId: string;
  signerPhrase: string;
}

export async function createVoteRequest({ artwork_id, request, adminCapId, packageId, signerPhrase }: VoteRequestParams) {
  // console.log("Mint artwork shard for: %s", artwork_id);

  const { signer } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::create_vote_request`,
    arguments: [tx.object(adminCapId), tx.pure(artwork_id), tx.pure(request)],
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

