import { ExecutionStatus, getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID, USER1_PHRASE } from "./config";
import { getSigner } from "./helpers";

export async function splitArtworkShard(
  artworkShard: string,
  shares: number
): Promise<ExecutionStatus | undefined> {
  const { signer } = getSigner(USER1_PHRASE);
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
  return getExecutionStatus(txRes);
}
