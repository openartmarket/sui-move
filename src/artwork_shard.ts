import { TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, PACKAGE_ID } from "./config";
import { findObjectIdWithOwnerAddress} from "./findObjectIdWithOwnerAddress"
import { getSigner } from "./helpers";

export type MintArtworkShardParams = {
  artworkId: string;
  phrase: string;
  shares: number;
};

export type MintArtworkShardResult = {
  artworkShardId: string;
  digest: string;
};

/**
 * Mints an artwork shard
 * @returns artwork shard id
 */
export async function mintArtworkShard(
  params: MintArtworkShardParams
): Promise<MintArtworkShardResult> {
  const { artworkId, phrase, shares } = params;
  const { signer } = getSigner('gadget fall ginger unit clerk arctic cool silly cream phone praise acid');
  const { address } = getSigner(phrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::mint_artwork_shard`,
    arguments: [tx.object(ADMIN_CAP_ID), tx.object(artworkId), tx.pure(shares), tx.pure(address)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  const artworkShardId = findObjectIdWithOwnerAddress(txRes, address)
  const { digest } = txRes;
  return { artworkShardId, digest };
}


