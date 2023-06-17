import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export async function splitArtworkShard(artworkShard: string, shares: number):Promise<string> {
  const { signer } = getSigner("user");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::split_artwork_shard`,
    arguments: [tx.object(artworkShard), tx.pure(shares)],
  });

  console.log("Split artwork shard: %s", artworkShard);

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  const artworkShardId = getCreatedObjects(txRes)?.[0].reference.objectId;
  if(!artworkShardId) throw new Error("Failed to split artwork shard");
  return artworkShardId;
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  splitArtworkShard("{artworkShard}", 2);
}
