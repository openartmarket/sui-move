import { TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";
import { CreateContractStockDisplayParams } from "./types";

// This is the function you can update to change the display fields
function getContractStockDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
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

export async function createContractStockDisplay({
  ADMIN_PHRASE,
  CONTRACT_STOCK_TYPE,
  PUBLISHER_ID,
  SUI_NETWORK,
}: CreateContractStockDisplayParams) {
  const contractStockDisplayFields = getContractStockDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(ADMIN_PHRASE, SUI_NETWORK);
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

  await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}
