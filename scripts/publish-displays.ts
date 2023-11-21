import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { ContractFields, ContractStockFields, createDisplay } from "../src/createDisplay.js";
import { ADMIN_PHRASE, adminExecutor, PUBLISHER_ID } from "../test/test-helpers.js";

async function main() {
  const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
  const address = keypair.getPublicKey().toSuiAddress();

  await createDisplay(adminExecutor, {
    publisherId: PUBLISHER_ID,
    address,
    fields: ContractFields,
    type: "Contract",
  });

  await createDisplay(adminExecutor, {
    publisherId: PUBLISHER_ID,
    address,
    fields: ContractStockFields,
    type: "ContractStock",
  });

  console.log("✅ Displays created successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
