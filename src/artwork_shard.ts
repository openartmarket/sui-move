import { TransactionBlock } from "@mysten/sui.js";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import { MintArtworkShardParams, MintArtworkShardResult } from "./types";

/**
 * Mints an artwork shard
 * @returns artwork shard id
 */
export async function mintArtworkShard(
  params: MintArtworkShardParams
): Promise<MintArtworkShardResult> {
  const { artworkId, signerPhrase, receiverAddress, packageId, adminCapId, shares, network } =
    params;
  const { signer } = getSigner(signerPhrase, network);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_artwork_shard`,
    arguments: [
      tx.object(adminCapId),
      tx.object(artworkId),
      tx.pure(shares),
      tx.pure(receiverAddress),
    ],
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
  const artworkShardId = findObjectIdWithOwnerAddress(txRes, receiverAddress);
  const { digest } = txRes;
  return { artworkShardId, digest, owner: receiverAddress };
}
