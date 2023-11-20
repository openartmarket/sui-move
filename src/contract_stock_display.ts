import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner } from "./helpers.js";
import type { CreateContractStockDisplayParams } from "./types.js";

// This is the function you can update to change the display fields
function getContractStockDisplayFields() {
  return {
    keys: [
      "name",
      "artist",
      "description",
      "currency",
      "image_url",
      "thumbnail_url",
      "project_url",
    ],
    values: [
      "{name}",
      "{artist}",
      "{description}",
      "{currency}",
      "https://openartmarket.com/image/{reference}",
      "https://openartmarket.com/image/{reference}?thumb=1",
      "https://openartmarket.com/perma/{reference}",
    ],
  };
}

export async function createContractStockDisplay(
  client: SuiClient,
  { adminPhrase, contractStockType, publisherId }: CreateContractStockDisplayParams,
) {
  const contractStockDisplayFields = getContractStockDisplayFields();

  const tx = new TransactionBlock();
  const { keypair } = getSigner(adminPhrase);
  const address = keypair.getPublicKey().toSuiAddress();

  const contractStockDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(publisherId),
      tx.pure(contractStockDisplayFields.keys),
      tx.pure(contractStockDisplayFields.values),
    ],
    typeArguments: [contractStockType],
  });

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [contractStockDisplay],
    typeArguments: [contractStockType],
  });

  tx.transferObjects([contractStockDisplay], tx.pure(address));

  await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}
