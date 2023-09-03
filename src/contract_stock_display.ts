import { SuiClient } from "@mysten/sui.js/dist/cjs/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner } from "./helpers";
import { CreateContractStockDisplayParams } from "./types";

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
  { ADMIN_PHRASE, CONTRACT_STOCK_TYPE, PUBLISHER_ID }: CreateContractStockDisplayParams,
) {
  const contractStockDisplayFields = getContractStockDisplayFields();

  const tx = new TransactionBlock();
  const { keypair } = getSigner(ADMIN_PHRASE);
  const address = keypair.getPublicKey().toSuiAddress();

  const contractStockDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(PUBLISHER_ID),
      tx.pure(contractStockDisplayFields.keys),
      tx.pure(contractStockDisplayFields.values),
    ],
    typeArguments: [CONTRACT_STOCK_TYPE],
  });

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [contractStockDisplay],
    typeArguments: [CONTRACT_STOCK_TYPE],
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
