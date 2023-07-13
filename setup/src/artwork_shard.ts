import { TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID, USER1_PHRASE } from "./config";
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
  const { signer } = getSigner(ADMIN_PHRASE);
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
if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  mintArtworkShard({
    artworkId: "{artwork}",
    phrase: USER1_PHRASE,
    shares: 2,
  });
}


