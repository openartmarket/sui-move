import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { OwnedObjectList } from "../src";
import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { findObjectIdInOwnedObjectList } from "../src/findObjectIdWithOwnerAddress";
import { splitContractStock } from "../src/split_contract_stock";
import { transferContractStock } from "../src/transfer_contract_stock";
import {
  baseOptions,
  getObject,
  getOwnedObjects,
  mintContractOptions,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER2_PHRASE,
} from "./test-helpers";

describe("transferContractStock", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
  });

  it("should mint a stock and then transfer it", async () => {
    const { contractStockId } = await mintContractStock({
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 12,
    });

    await transferContractStock({
      ...baseOptions,
      contractId,
      contractStockId,
      signerPhrase: USER1_PHRASE,
      receiverAddress: USER2_ADDRESS,
    });

    const transferredStock = await getObject(contractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredStock.data.content.fields.shares, "12");
  }).timeout(30_000);

  it("should split a split stock and transfer it to new owner", async () => {
    const { contractStockId } = await mintContractStock({
      ...baseOptions,
      contractId,
      receiverAddress: USER2_ADDRESS,
      shares: 12,
    });

    const splitStockId1 = await splitContractStock({
      ...baseOptions,
      contractStockId,
      signerPhrase: USER2_PHRASE,
      shares: 5,
    });

    const oldStock = await getObject(contractStockId);
    const splitStock = await getObject(splitStockId1.contractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldStock.data.content.fields.shares, "7");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitStock.data.content.fields.shares, "5");

    const transferContractStockResponse = await transferContractStock({
      ...baseOptions,
      contractId,
      contractStockId: splitStockId1.contractStockId,
      signerPhrase: USER2_PHRASE,
      receiverAddress: USER1_ADDRESS,
    });

    const ownedObjects = await getOwnedObjects(transferContractStockResponse.owner);

    const transferredStock = findObjectIdInOwnedObjectList(
      ownedObjects as OwnedObjectList,
      splitStockId1.contractStockId
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredStock.data.objectId, splitStockId1.contractStockId);
  }).timeout(30_000);
});
