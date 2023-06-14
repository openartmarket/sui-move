import {
  TransactionBlock,
  getCreatedObjects,
  getTransactionEffects,
} from "@mysten/sui.js";
import { packageId, adminCap, adminPhrase, user1 } from "./config";
import { getSigner } from "./helpers";

export async function mintArtworkShard(artwork: string, account:string, shares: number) {
  // console.log("Mint artwork shard for: %s", artwork);

  let { signer } = getSigner(adminPhrase);
  let { address } = getSigner(account);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_artwork_shard`,
    arguments: [tx.object(adminCap), tx.object(artwork), tx.pure(shares), tx.pure(address)],
  });

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    // console.log("effects", getTransactionEffects(txRes));
    let artwork_shard_id = getCreatedObjects(txRes)?.[0].reference.objectId;
    // console.log("artwork_shard_id", artwork_shard_id);
    return artwork_shard_id;
  } catch (e) {
    // console.error("Could not mint artwork shard", e);
    throw new Error("Could not mint artwork shard");
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  mintArtworkShard(
    "0x3e88c14f87d56779b90429095d5dc30a995e3b4edf27e206366f192275eb4d84",
    user1,
    2
  );
}
