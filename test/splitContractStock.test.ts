import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/split_contract_stock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  baseOptions,
  getClient,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";
import { getObject } from "./test-helpers";

describe("splitContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  beforeEach(async function () {
    executor = new SuiExecutor({ client, signerPhrase: ADMIN_PHRASE, packageId: PACKAGE_ID });
    contractId = await mintContract(client, mintContractOptions);
  }, 20_000);

  it("should split an contract stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 10,
      },
    ]);

    const splitStockId = await splitContractStock(client, {
      ...baseOptions,
      contractStockId,
      signerPhrase: USER1_PHRASE,
      quantity: 2,
    });

    // Get the stock and check that it has 2 shares
    const splitStock = await getObject(splitStockId.contractStockId);
    const oldStock = await getObject(contractStockId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitStock.data.content.fields.shares, "2");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldStock.data.content.fields.shares, "8");
  }, 30_000);

  it("should split a split stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 12,
      },
    ]);

    const splitStockId = await splitContractStock(client, {
      ...baseOptions,
      contractStockId,
      signerPhrase: USER1_PHRASE,
      quantity: 5,
    });
    const splitAgainStockId = await splitContractStock(client, {
      ...baseOptions,
      contractStockId: splitStockId.contractStockId,
      signerPhrase: USER1_PHRASE,
      quantity: 3,
    });

    const oldStock = await getObject(contractStockId);
    const splitStock = await getObject(splitStockId.contractStockId);
    const splitAgainStock = await getObject(splitAgainStockId.contractStockId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldStock.data.content.fields.shares, "7");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitStock.data.content.fields.shares, "2");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitAgainStock.data.content.fields.shares, "3");
  }, 30_000);
});
