import { TransactionBlock } from "@mysten/sui.js";

import { ARTWORK_TYPE, PUBLISHER_ID } from "./config";
import { ADMIN_PHRASE } from "./config";
import { getSigner } from "./helpers";

// This is the function you can update to change the display fields
function getArtworkDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
  return {
    keys: ["name", "description", "image_url", "project_url"],
    values: [
      "{name}",
      "{description}",
      `${imageProviderUrlPrefix}{image_url}${imageProviderUrlPostfix}`,
      "https://www.openartmarket.com/",
    ],
  };
}

async function createArtworkDisplay() {
  const artworkDisplayFields = getArtworkDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(ADMIN_PHRASE);

  const artworkDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(PUBLISHER_ID),
      tx.pure(artworkDisplayFields.keys),
      tx.pure(artworkDisplayFields.values),
    ],
    typeArguments: [ARTWORK_TYPE],
  });

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [artworkDisplay],
    typeArguments: [ARTWORK_TYPE],
  });

  tx.transferObjects([artworkDisplay], tx.pure(address));
  await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}

createArtworkDisplay();
