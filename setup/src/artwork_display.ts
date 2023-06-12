import {
  TransactionBlock,
  getCreatedObjects,
  getExecutionStatus,
} from "@mysten/sui.js";
import { ARTWORK_TYPE, publisher } from "./config";
import { getSigner } from "./helpers";

// This is the function you can update to change the display fields
function getArtworkDisplayFields(
  imageProviderUrlPrefix = "",
  imageProviderUrlPostfix = ""
) {
  return {
    keys: [
      "name",
      "description",
      "image_url",
      "project_url",
    ],
    values: [
      "{name}",
      "{description}",
      `${imageProviderUrlPrefix}{image_url}${imageProviderUrlPostfix}`,
      "https://www.openartmarket.com/",
    ],
  };
}

async function createArtworkDisplay() {
  let artworkDisplayFields = getArtworkDisplayFields();

  let tx = new TransactionBlock();
  let {signer, address} = getSigner('admin');

  let artworkDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(publisher),
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

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("display", getCreatedObjects(txRes)?.[0]?.reference?.objectId);
    console.log("effects", getExecutionStatus(txRes)?.status, txRes.effects);
  } catch (e) {
    console.error("Could not create display", e);
  }
}

createArtworkDisplay();
