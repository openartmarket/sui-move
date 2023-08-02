import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getExecutionStatus, getSigner, handleTransactionResponse } from "./helpers";
import { VoteParams } from "./types";

export async function vote({
  contractId,
  voteRequest,
  voterAccount,
  choice,
  packageId,
  network,
}: VoteParams) {
  const { keypair } = getSigner(voterAccount);
  const client = getClient(network);
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
  return getExecutionStatus(txRes);
}
