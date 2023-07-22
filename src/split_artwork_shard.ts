import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID } from "./config";
import { findObjectIdWithOwnerAddress} from "./findObjectIdWithOwnerAddress"
import { getSigner } from "./helpers";

export async function splitArtworkShard(
  artworkShard: string,
  fromUser: string,
  shares: number
): Promise<string> {
  const { signer, address } = getSigner(fromUser);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::split_artwork_shard`,
    arguments: [tx.object(artworkShard), tx.pure(shares)],
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
  
  const artworkShardId = findObjectIdWithOwnerAddress(txRes, address)
  return artworkShardId;
}
