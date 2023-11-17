import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { splitContractStock } from "../src/split_contract_stock";
import {
  baseOptions,
  getClient,
  mintContractOptions,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";
import { getObject } from "./test-helpers";

describe("splitContractStock", () => {
  const client = getClient();
  let contractId: string;
  beforeEach(async function () {
    this.timeout(20_000);
    contractId = await mintContract(client, mintContractOptions);
  });

  it("should split an contract stock", async () => {
    const { contractStockId } = await mintContractStock(client, {
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 10,
    });

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
  }).timeout(30_000);

  it("should split a split stock", async () => {
    const { contractStockId } = await mintContractStock(client, {
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 12,
      ...baseOptions,
    });

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
  }).timeout(30_000);
});
