import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner, handleTransactionResponse } from "./helpers";
import { VoteParams } from "./types";

export async function vote({ artworkId, voteRequest, voterAccount, choice }: VoteParams) {
  const { signer } = getSigner(voterAccount);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao::vote`,
    arguments: [tx.object(artworkId), tx.object(voteRequest), tx.pure(choice)],
  });
  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
  return getExecutionStatus(txRes);
}
