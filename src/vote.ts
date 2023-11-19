import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse } from "./helpers";
import type { VoteParams } from "./types";

export async function vote(
  client: SuiClient,
  { contractId, voteRequest, voterAccount, choice, packageId }: VoteParams,
) {
  const { keypair } = getSigner(voterAccount);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::vote`,
    arguments: [tx.object(contractId), tx.object(voteRequest), tx.pure(choice)],
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
