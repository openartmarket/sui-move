import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { VoteRequestParams } from "./types";

export async function createVoteRequest({
  artworkId,
  request,
  adminCapId,
  packageId,
  signerPhrase,
  network,
}: VoteRequestParams): Promise<string> {
  const { signer } = getSigner(signerPhrase, network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::create_vote_request`,
    arguments: [tx.object(adminCapId), tx.pure(artworkId), tx.pure(request)],
  });
  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  const vote_request_id = getCreatedObjects(txRes)?.[0].reference.objectId;
  if (!vote_request_id) throw new Error("Vote request not created");
  return vote_request_id;
}
