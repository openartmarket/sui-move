import { getCreatedObjects, getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { ARTWORK_SHARD_TYPE, publisher } from "./config";
import { adminPhrase } from "./config";
import { getSigner } from "./helpers";

// This is the function you can update to change the display fields
function getArtworkShardDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
  return {
    keys: ["name", "description", "image_url", "project_url"],
    values: [
      "{artwork_name}",
      "{description}",
      `${imageProviderUrlPrefix}{image_url}${imageProviderUrlPostfix}`,
      "https://www.openartmarket.com/",
    ],
  };
}

async function createArtworkShardDisplay() {
  const artworkShardDisplayFields = getArtworkShardDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(adminPhrase);
  const artworkShardDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(publisher),
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

  try {
    const txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    // console.log("display", getCreatedObjects(txRes)?.[0]?.reference?.objectId);
    // console.log("effects", getExecutionStatus(txRes)?.status, txRes.effects);
  } catch (e) {
    // console.error("Could not create display", e);
  }
}

createArtworkShardDisplay();
