import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { OwnedObjectList } from "../src";
import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { findObjectIdInOwnedObjectList } from "../src/findObjectIdWithOwnerAddress";
import { splitContractStock } from "../src/split_contract_stock";
import { transferContractStock } from "../src/transfer_contract_stock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getObject,
  getOwnedObjects,
  mintContractOptions,
  PACKAGE_ID,
  provider,
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
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      provider,
    });

    await transferContractStock({
      contractId,
      contractStockId,
      signerPhrase: USER1_PHRASE,
      receiverAddress: USER2_ADDRESS,
      packageId: PACKAGE_ID,
      provider,
    });

    const transferredStock = await getObject(contractStockId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredStock.data.content.fields.shares, "12");
  });

  it("should split a split stock and transfer it to new owner", async () => {
    const { contractStockId } = await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      provider,
    });

    const splitStockId1 = await splitContractStock({
      contractStockId,
      signerPhrase: USER2_PHRASE,
      shares: 5,
      packageId: PACKAGE_ID,
      provider,
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
      contractId,
      contractStockId: splitStockId1.contractStockId,
      signerPhrase: USER2_PHRASE,
      receiverAddress: USER1_ADDRESS,
      packageId: PACKAGE_ID,
      provider,
    });

    const ownedObjects = await getOwnedObjects(transferContractStockResponse.owner);
    const transferredStock = findObjectIdInOwnedObjectList(
      ownedObjects as OwnedObjectList,
      splitStockId1.contractStockId
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredStock.data.objectId, splitStockId1.contractStockId);
  });
});
