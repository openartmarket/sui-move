import { beforeEach, describe, expect, it } from "vitest";

import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitTransferMerge } from "../src/splitTransferMerge";
import { newAddress } from "../src/sui";
import {
  ADMIN_CAP_ID,
  adminExecutor,
  getQuantity,
  mintContractOptions,
  newUserExecutor,
  PACKAGE_ID,
} from "./test-helpers";

describe("splitTransferMerge", () => {
  let contractId: string;
  beforeEach(async () => {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;
  });

  it("should transfer stocks and make sure everything is merged", async () => {
    const user1 = await newAddress();
    const user2 = await newAddress();

    await mintContractStock(adminExecutor, [
      // User 1 has bought stocks in 3 batches. Total: 9
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 1,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 3,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 5,
      },
      // User 2 has bought stocks in 2 batches. Total: 16
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 7,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 9,
      },
    ]);

    const user1Executor = newUserExecutor(user1);
    const user2Executor = newUserExecutor(user2);

    const { fromContractStockId, toContractStockId } = await splitTransferMerge({
      packageId: PACKAGE_ID,
      fromExecutor: user1Executor,
      toExecutor: user2Executor,
      contractId,
      fromAddress: user1.address,
      toAddress: user2.address,
      quantity: 2,
    });

    expect(await getQuantity(user1Executor.suiClient, fromContractStockId)).toEqual(7);
    expect(await getQuantity(user2Executor.suiClient, toContractStockId)).toEqual(18);

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);
});
