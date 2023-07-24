import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner } from "./helpers";

export type SplitArtworkShardParams = {
  packageId: string;
  artworkShardId: string,
  signerPhrase: string,
  shares: number
}
export type SplitArtworkShardResult = {
  artworkShardId: string,
  owner: string
}

export async function splitArtworkShard( params:SplitArtworkShardParams ): Promise<SplitArtworkShardResult> {
  const { artworkShardId, signerPhrase, shares, packageId } = params;
  const { signer, address } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::split_artwork_shard`,
    arguments: [tx.object(artworkShardId), tx.pure(shares)],
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
  const newArtworkShardId = findObjectIdWithOwnerAddress(txRes, address);
  return {
    artworkShardId: newArtworkShardId,
    owner: address
  };
}
