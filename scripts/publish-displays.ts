import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import { ContractFields, ContractStockFields, createDisplay } from "../src/createDisplay.js";
import { SuiExecutor } from "../src/Executor.js";
import { ADMIN_PHRASE, getClient, PACKAGE_ID, PUBLISHER_ID } from "../test/test-helpers.js";

async function main() {
  const client = getClient();

  const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
  const executor = new SuiExecutor({
    suiClient: client,
    keypair,
    packageId: PACKAGE_ID,
  });
  const address = keypair.getPublicKey().toSuiAddress();

  await createDisplay(executor, {
    publisherId: PUBLISHER_ID,
    address,
    fields: ContractFields,
    type: "Contract",
  });

  await createDisplay(executor, {
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
