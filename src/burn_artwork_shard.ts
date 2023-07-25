import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { BurnArtworkParams, BurnArtworkResult } from "./types";

export async function burnArtworkShard(params: BurnArtworkParams): Promise<BurnArtworkResult> {
  const { artworkShardId, artworkId, packageId, signerPhrase } = params;
  const { signer, address } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::safe_burn_artwork_shard`,
    arguments: [tx.object(artworkId), tx.object(artworkShardId)],
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
    artworkShardId,
    success: true,
    owner: address,
  };
}
