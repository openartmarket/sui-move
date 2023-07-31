import { TransactionBlock } from "@mysten/sui.js";

import { getProvider } from "../test/test-helpers";
import { getSigner } from "./helpers";
import { CreateContractDisplayParams } from "./types";

// This is the function you can update to change the display fields
function getContractDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
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

export async function createContractDisplay({
  CONTRACT_TYPE,
  PUBLISHER_ID,
  ADMIN_PHRASE,
  SUI_NETWORK,
}: CreateContractDisplayParams) {
  const contractDisplayFields = getContractDisplayFields();

  const tx = new TransactionBlock();
  const { signer, address } = getSigner(ADMIN_PHRASE, getProvider(SUI_NETWORK));

  const contractDisplay = tx.moveCall({
    target: "0x2::display::new_with_fields",
    arguments: [
      tx.object(PUBLISHER_ID),
      tx.pure(contractDisplayFields.keys),
      tx.pure(contractDisplayFields.values),
    ],
    typeArguments: [CONTRACT_TYPE],
  });

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [contractDisplay],
    typeArguments: [CONTRACT_TYPE],
  });

  tx.transferObjects([contractDisplay], tx.pure(address));
  await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}
