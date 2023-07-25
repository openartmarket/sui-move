import { TransactionBlock } from "@mysten/sui.js";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import { ArtworkShardDetails, SplitArtworkShardParams } from "./types";

export async function splitArtworkShard(
  params: SplitArtworkShardParams
): Promise<ArtworkShardDetails> {
  const { artworkShardId, signerPhrase, shares, packageId, network } = params;
  const { signer, address } = getSigner(signerPhrase, network);
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

  handleTransactionResponse(txRes);
  const newArtworkShardId = findObjectIdWithOwnerAddress(txRes, address);
  return {
    artworkShardId: newArtworkShardId,
    owner: address,
  };
}
