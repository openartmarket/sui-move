import { createContractDisplay } from "../src/contract_display";
import { createContractStockDisplay } from "../src/contract_stock_display";
import { NetworkName } from "../src/types";
import {
  ADMIN_PHRASE,
  CONTRACT_STOCK_TYPE,
  CONTRACT_TYPE,
  getClient,
  getEnv,
  PUBLISHER_ID,
} from "../test/test-helpers";

const SUI_NETWORK_NAME = getEnv("SUI_NETWORK");

async function main() {
  console.log("👉 Creating contract and stock display on", SUI_NETWORK_NAME);
  const client = getClient();

  await createContractDisplay(client, {
    ADMIN_PHRASE,
    CONTRACT_TYPE,
    PUBLISHER_ID,
    SUI_NETWORK: SUI_NETWORK_NAME as NetworkName,
  });
  await createContractStockDisplay(client, {
    ADMIN_PHRASE,
    CONTRACT_STOCK_TYPE,
    PUBLISHER_ID,
    SUI_NETWORK: SUI_NETWORK_NAME as NetworkName,
  });

  console.log("✅ Displays created successfully!");
}

main();
