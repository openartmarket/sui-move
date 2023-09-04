import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getCreatedObjects, getSigner, handleTransactionResponse } from "./helpers";
import { VoteRequestParams } from "./types";

export async function createVoteRequest(
  client: SuiClient,
  { contractId, request, adminCapId, packageId, signerPhrase }: VoteRequestParams,
): Promise<string> {
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::start_vote`,
    arguments: [tx.object(adminCapId), tx.pure(contractId), tx.pure(request)],
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  const vote_request_id = getCreatedObjects(txRes)?.[0].objectId;
  if (!vote_request_id) throw new Error("Vote request not created");
  return vote_request_id;
}
