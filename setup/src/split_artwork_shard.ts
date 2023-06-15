import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export async function splitArtworkShard(artwork: string, artworkShard: string, shares: number) {
  const { signer } = getSigner("user");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::split_artwork_shard`,
    arguments: [tx.object(artwork), tx.object(artworkShard), tx.pure(shares)],
  });

  console.log("Split artwork shard for: %s", artwork);

  try {
    const txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("effects", getExecutionStatus(txRes));
  } catch (e) {
    console.error("Could not split artwork shard", e);
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  splitArtworkShard("{artwork}", "{artworkShard}", 2);
}
