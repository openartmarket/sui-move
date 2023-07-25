import { TransactionBlock } from "@mysten/sui.js";

import { ADMIN_PHRASE, PUBLISHER_ID } from "../test/test-helpers";
import { ARTWORK_SHARD_TYPE } from "./config";
import { getSigner } from "./helpers";

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

async function createArtworkShardDisplay() {
  const artworkShardDisplayFields = getArtworkShardDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(ADMIN_PHRASE);
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

createArtworkShardDisplay();
