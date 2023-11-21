import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import { getContractStocks } from "../src/getContractStocks";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { transferContractStock } from "../src/transferContractStock";
import {
  ADMIN_CAP_ID,
  adminExecutor,
  mintContractOptions,
  newUserExecutor,
  PACKAGE_ID,
} from "./test-helpers";

describe("transferContractStock", () => {
  let contractId: string;
  let user1: SuiAddress;
  let user2: SuiAddress;
  beforeEach(async () => {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
    user2 = await newAddress();
  });

  it("should transfer ownership", async () => {
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
    await transferContractStock(user1Executor, {
      contractId,
      contractStockId,
      toAddress: user2.address,
    });

    const contractStocks = await getContractStocks({
      suiClient: user1Executor.suiClient,
      owner: user2.address,
      contractId,
      packageId: PACKAGE_ID,
    });
    expect(contractStocks).toHaveLength(1);
    expect(contractStocks[0].objectId).toEqual(contractStockId);
  }, 30_000);
});
