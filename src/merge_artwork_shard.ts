import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export type MergeArtworkShardParams = {
  artworkShard1Id: string,
  artworkShard2Id: string,
  signerPhrase: string,
}
export type MergeArtworkShardResult = {
  artworkShardId: string,
  owner: string
}

export async function mergeArtworkShard( params:MergeArtworkShardParams ): Promise<MergeArtworkShardResult> {
  const { artworkShard1Id, artworkShard2Id, signerPhrase } = params;
  const { signer, address } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::merge_artwork_shards`,
    arguments: [tx.object(artworkShard1Id),tx.object(artworkShard2Id)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });

  const status = getExecutionStatus(txRes);
  if(status === undefined) {
    throw new Error("Failed to get execution status");
  }
  if(status.error) {
    throw new Error(status.error);
  }
  if(status.status !== "success") {
    throw new Error(`Transaction failed with status: ${status.status}`);
  }
  return {
    artworkShardId: artworkShard1Id,
    owner: address

  };
}
