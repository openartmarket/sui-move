import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { ArtworkShardDetails, MergeArtworkShardParams } from "./types";

export async function mergeArtworkShard(
  params: MergeArtworkShardParams
): Promise<ArtworkShardDetails> {
  const { artworkShard1Id, artworkShard2Id, signerPhrase, packageId } = params;
  const { signer, address } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::merge_artwork_shards`,
    arguments: [tx.object(artworkShard1Id), tx.object(artworkShard2Id)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });

  handleTransactionResponse(txRes);
  return {
    artworkShardId: artworkShard1Id,
    owner: address,
  };
}
