import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import { mergeContractStock } from "../src/merge_contract_stock";
import { mintContractStock } from "../src/mint_contract_stock";
import {
  baseOptions,
  getClient,
  getObject,
  mintContractOptions,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";

describe("mergeContractStock", () => {
  const client = getClient();
  let contractId: string;
  beforeEach(async function () {
    contractId = await mintContract(client, mintContractOptions);
  }, 20_000);

  it("should merge contract stocks", async () => {
    const { contractStockId: toContractStockId } = await mintContractStock(client, {
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 10,
    });
    const { contractStockId: fromContractStockId } = await mintContractStock(client, {
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 10,
    });

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
