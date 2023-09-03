import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse } from "./helpers";
import { EndVoteRequestParams } from "./types";

export async function endRequestVoting(
  client: SuiClient,
  { voteRequest, packageId, signerPhrase, adminCapId }: EndVoteRequestParams,
) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::end_vote`,
    arguments: [tx.object(adminCapId), tx.object(voteRequest)],
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);

  return "success";
}
