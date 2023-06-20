import { ExecutionStatus, getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export async function splitArtworkShard(
  artworkShard: string,
  fromUser: string,
  shares: number
): Promise<ExecutionStatus | undefined> {
  const { signer } = getSigner(fromUser);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::split_artwork_shard`,
    arguments: [tx.object(artworkShard), tx.pure(shares)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });

  console.log('confirmedLocalExecution', txRes.confirmedLocalExecution)

  return getExecutionStatus(txRes);
}
