import assert from "assert";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { mergeContractStock } from "../src/merge_contract_stock";
import {
  baseOptions,
  getObject,
  mintContractOptions,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";

describe("mergeContractStock", () => {
  let contractId: string;
  beforeEach(async function () {
    this.timeout(20_000);
    contractId = await mintContract(mintContractOptions);
  });

  it("should merge contract stocks", async () => {
    const { contractStockId } = await mintContractStock({
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
    });
    const { contractStockId: contractStock2Id } = await mintContractStock({
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
    });

    const mergeContractStocks = await mergeContractStock({
      ...baseOptions,
      contractStock1Id: contractStockId,
      contractStock2Id,
      signerPhrase: USER1_PHRASE,
    });
    const burnedStock = await getObject(contractStock2Id);
    const newStock = await getObject(mergeContractStocks.contractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(newStock.data.content.fields.shares, "20");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(burnedStock.error.code, "deleted");
  }).timeout(30_000);
});
