import { beforeEach, describe, expect, it } from "vitest";

import { getAvailableStock } from "../src";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { getObjectData } from "../src/getters";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/splitContractStock";
import { transferContractStock } from "../src/transferContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER2_PHRASE,
} from "./test-helpers";

describe("transferContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  beforeEach(async () => {
    executor = new SuiExecutor({ client, signerPhrase: ADMIN_PHRASE, packageId: PACKAGE_ID });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;
  });

  it("should mint a stock and then transfer it", async () => {
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

    const user1Executor = new SuiExecutor({
      client,
      signerPhrase: USER1_PHRASE,
      packageId: PACKAGE_ID,
    });
    await transferContractStock(user1Executor, {
      contractId,
      contractStockId,
      receiverAddress: USER2_ADDRESS,
    });

    const ownedObjects = await client.getOwnedObjects({
      owner: USER2_ADDRESS,
    });

    const ownedObject = ownedObjects.data.find((response) => {
      const objectData = getObjectData(response);
      return objectData.objectId === contractStockId;
    });
    expect(ownedObject).toBeDefined();
  }, 30_000);

  it("should split a split stock and transfer it to new owner", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 12,
      },
    ]);

    const user2Executor = new SuiExecutor({
      client,
      signerPhrase: USER2_PHRASE,
      packageId: PACKAGE_ID,
    });
    const { splitContractStockId } = await splitContractStock(user2Executor, {
      contractStockId,
      quantity: 5,
    });

    const oldQuantity = await getAvailableStock(client, contractStockId);
    expect(oldQuantity).toBe(7);

    const splitQuantity = await getAvailableStock(client, splitContractStockId);
    expect(splitQuantity).toBe(5);

    await transferContractStock(user2Executor, {
      contractId,
      contractStockId: splitContractStockId,
      receiverAddress: USER1_ADDRESS,
    });

    const ownedObjects = await client.getOwnedObjects({
      owner: USER1_ADDRESS,
    });
    const ownedObject = ownedObjects.data.find((response) => {
      const objectData = getObjectData(response);
      return objectData.objectId === splitContractStockId;
    });
    expect(ownedObject).toBeDefined();
  }, 30_000);
});
