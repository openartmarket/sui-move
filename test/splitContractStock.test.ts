import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { splitContractStock } from "../src/split_contract_stock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";
import { getObject } from "./test-helpers";

describe("splitContractStock", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
  });

  it("should split an contract stock", async () => {
    const { contractStockId } = await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const splitStockId = await splitContractStock({
      contractStockId,
      signerPhrase: USER1_PHRASE,
      shares: 2,
      packageId: PACKAGE_ID,
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
  });

  it("should split a split stock", async () => {
    const { contractStockId } = await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const splitStockId = await splitContractStock({
      contractStockId,
      signerPhrase: USER1_PHRASE,
      shares: 5,
      packageId: PACKAGE_ID,
    });
    const splitAgainStockId = await splitContractStock({
      contractStockId: splitStockId.contractStockId,
      signerPhrase: USER1_PHRASE,
      shares: 3,
      packageId: PACKAGE_ID,
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
  });
});
