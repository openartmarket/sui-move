import { TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";

export type TransferArtworkShardParams = {
    artworkId: string;
    artworkShardId: string;
    packageId: string;
    signerPhrase: string;
    recieverPhrase: string;
};

export type TransferArtworkShardResult = {
  artworkShardId: string;
  digest: string;
  address: string;
};

/**
 * Mints an artwork shard
 * @returns artwork shard id
 */
export async function transferArtworkShard(
  params: TransferArtworkShardParams
): Promise<TransferArtworkShardResult> {
  const { artworkId, signerPhrase, recieverPhrase, artworkShardId, packageId } = params;
  const { signer } = getSigner(signerPhrase);
  const { address } = getSigner(recieverPhrase);
  //console.log('New receiver', address)
  //console.log("Transfer artwork shard: %s", artworkShardId);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_artwork_shard`,
    arguments: [tx.object(artworkId), tx.pure(artworkShardId), tx.pure(address)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  // console.log(txRes);
//  const artworkShardId = findObjectIdWithOwnerAddress(txRes, address)
  const { digest } = txRes;
  return { artworkShardId, digest, address };
}


