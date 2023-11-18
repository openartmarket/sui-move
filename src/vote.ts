import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse, voteMoveCall } from "./helpers";
import type { VoteParams } from "./types";

export async function vote(
  client: SuiClient,
  { contractId, voteRequest, voterAccount, choice, packageId }: VoteParams,
) {
  const { keypair } = getSigner(voterAccount);
  const tx = new TransactionBlock();

  voteMoveCall({ tx, packageId, contractId, voteRequest, choice });

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
