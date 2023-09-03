import { SuiClient } from "@mysten/sui.js/dist/cjs/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner } from "./helpers";
import { CreateContractDisplayParams } from "./types";

// This is the function you can update to change the display fields
function getContractDisplayFields() {
  return {
    keys: ["name", "artist", "description", "currency", "image_url", "project_url"],
    values: [
      "{name}",
      "{artist}",
      "{description}",
      "{currency}",
      "https://openartmarket.com/image/{reference}",
      "https://openartmarket.com/perma/{reference}",
    ],
  };
}

export async function createContractDisplay(
  client: SuiClient,
  { CONTRACT_TYPE, PUBLISHER_ID, ADMIN_PHRASE }: CreateContractDisplayParams,
) {
  const contractDisplayFields = getContractDisplayFields();

  const { keypair } = getSigner(ADMIN_PHRASE);
  const address = keypair.getPublicKey().toSuiAddress();
  const tx = new TransactionBlock();

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
  await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
}
