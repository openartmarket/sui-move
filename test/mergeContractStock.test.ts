import assert from "assert";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { mergeContractStock } from "../src/merge_contract_stock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getObject,
  mintContractOptions,
  PACKAGE_ID,
  provider,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";

describe("mergeContractStock", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
  });

  it("should merge contract stocks", async () => {
    const { contractStockId } = await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      provider,
    });
    const { contractStockId: contractStock2Id } = await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      provider,
    });

    const mergeContractStocks = await mergeContractStock({
      contractStock1Id: contractStockId,
      contractStock2Id,
      signerPhrase: USER1_PHRASE,
      packageId: PACKAGE_ID,
      provider,
    });
    const burnedStock = await getObject(contractStock2Id);
    const newStock = await getObject(mergeContractStocks.contractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(newStock.data.content.fields.shares, "20");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(burnedStock.error.code, "deleted");
  });
});
