import { TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";
import { CreateArtworkShardDisplayParams } from "./types";

// This is the function you can update to change the display fields
function getArtworkShardDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
  return {
    keys: ["name", "description", "currency", "image_url", "project_url"],
    values: [
      "{name}",
      "{description}",
      "{currency}",
      `${imageProviderUrlPrefix}{image_url}${imageProviderUrlPostfix}`,
      "https://www.openartmarket.com/",
    ],
  };
}

export async function createArtworkShardDisplay({
  ADMIN_PHRASE,
  ARTWORK_SHARD_TYPE,
  PUBLISHER_ID,
  SUI_NETWORK,
}: CreateArtworkShardDisplayParams) {
  const artworkShardDisplayFields = getArtworkShardDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(ADMIN_PHRASE, SUI_NETWORK);
  const artworkShardDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(PUBLISHER_ID),
      tx.pure(artworkShardDisplayFields.keys),
      tx.pure(artworkShardDisplayFields.values),
    ],
    typeArguments: [ARTWORK_SHARD_TYPE],
  });

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [artworkShardDisplay],
    typeArguments: [ARTWORK_SHARD_TYPE],
  });

  tx.transferObjects([artworkShardDisplay], tx.pure(address));

  await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}
