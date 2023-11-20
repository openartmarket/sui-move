import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mergeContractStock } from "../src/merge_contract_stock";
import { mintContractStock } from "../src/mintContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  baseOptions,
  getClient,
  getObject,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";

describe("mergeContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  beforeEach(async function () {
    executor = new SuiExecutor({ client, signerPhrase: ADMIN_PHRASE, packageId: PACKAGE_ID });
    contractId = await mintContract(client, mintContractOptions);
  }, 20_000);

  it("should merge contract stocks", async () => {
    const {
      contractStockIds: [toContractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 10,
      },
    ]);

    const {
      contractStockIds: [fromContractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 10,
      },
    ]);

    await mergeContractStock(client, {
      ...baseOptions,
      toContractStockId,
      fromContractStockId,
      signerPhrase: USER1_PHRASE,
    });
    const burnedStock = await getObject(fromContractStockId);
    const newStock = await getObject(toContractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(newStock.data.content.fields.shares, "20");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(burnedStock.error.code, "deleted");
  }, 30_000);
});
