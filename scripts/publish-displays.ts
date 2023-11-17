import { createContractDisplay } from "../src/contract_display";
import { createContractStockDisplay } from "../src/contract_stock_display";
import {
  ADMIN_PHRASE,
  CONTRACT_STOCK_TYPE,
  CONTRACT_TYPE,
  getClient,
  PUBLISHER_ID,
} from "../test/test-helpers";

async function main() {
  const client = getClient();

  await createContractDisplay(client, {
    adminPhrase: ADMIN_PHRASE,
    contractType: CONTRACT_TYPE,
    publisherId: PUBLISHER_ID,
  });
  await createContractStockDisplay(client, {
    adminPhrase: ADMIN_PHRASE,
    contractStockType: CONTRACT_STOCK_TYPE,
    publisherId: PUBLISHER_ID,
  });

  console.log("✅ Displays created successfully!");
}

main();
