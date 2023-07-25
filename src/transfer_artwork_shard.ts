import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { TransferArtworkShardParams, TransferArtworkShardResult } from "./types";

/**
 * Mints an artwork shard
 * @returns artwork shard id
 */
export async function transferArtworkShard(
  params: TransferArtworkShardParams
): Promise<TransferArtworkShardResult> {
  const { artworkId, signerPhrase, receiverAddress, artworkShardId, packageId } = params;
  const { signer } = getSigner(signerPhrase);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_artwork_shard`,
    arguments: [tx.object(artworkId), tx.pure(artworkShardId), tx.pure(receiverAddress)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  handleTransactionResponse(txRes);
  const { digest } = txRes;
  return { artworkShardId, digest, owner: receiverAddress };
}
