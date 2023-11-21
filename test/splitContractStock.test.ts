import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/splitContractStock";
import {
  ADMIN_CAP_ID,
  adminExecutor,
  getQuantity,
  mintContractOptions,
  newUserExecutor,
} from "./test-helpers";

describe("splitContractStock", () => {
  let contractId: string;
  let user1: SuiAddress;
  beforeEach(async function () {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
  }, 20_000);

  it("should split an contract stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 10,
      },
    ]);

    const user1Executor = newUserExecutor(user1);
    const { splitContractStockId } = await splitContractStock(user1Executor, {
      contractStockId,
      quantity: 2,
    });

    expect(await getQuantity(user1Executor.suiClient, splitContractStockId)).toEqual(2);
    expect(await getQuantity(user1Executor.suiClient, contractStockId)).toEqual(8);
  }, 30_000);

  it("should split a split stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 12,
      },
    ]);

    const user1Executor = newUserExecutor(user1);

    const { splitContractStockId } = await splitContractStock(user1Executor, {
      contractStockId,
      quantity: 5,
    });
    const { splitContractStockId: splitAgainContractStockId } = await splitContractStock(
      user1Executor,
      {
        contractStockId: splitContractStockId,
        quantity: 3,
      },
    );

    expect(await getQuantity(user1Executor.suiClient, contractStockId)).toEqual(7);
    expect(await getQuantity(user1Executor.suiClient, splitContractStockId)).toEqual(2);
    expect(await getQuantity(user1Executor.suiClient, splitAgainContractStockId)).toEqual(3);
  }, 30_000);
});
