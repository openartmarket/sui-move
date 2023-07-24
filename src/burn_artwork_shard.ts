import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export type BurnArtworkParams = {
  artworkId: string,
  artworkShardId: string,
  signerPhrase: string,
}
export type BurnArtworkResult = {
  success: boolean,
  owner: string
}

export async function burnArtworkShard( params:BurnArtworkParams ): Promise<BurnArtworkResult> {
  const { artworkShardId, artworkId, signerPhrase } = params;
  const { signer, address } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::safe_burn_artwork_shard`,
    arguments: [tx.object(artworkId),tx.object(artworkShardId)],
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
    success: true,
    owner: address

  };
}
