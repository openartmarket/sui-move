import { beforeEach, describe, expect, it } from "vitest";

import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { splitTransferMerge } from "../src/splitTransferMerge.js";
import {
  ADMIN_CAP_ID,
  adminWallet,
  getQuantity,
  makeWallet,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers.js";

describe("splitTransferMerge", () => {
  let contractId: string;
  beforeEach(async () => {
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;
  });

  it("should transfer stocks and make sure everything is merged", async () => {
    const fromWallet = await makeWallet();
    const toWallet = await makeWallet();

    await mintContractStock(adminWallet, [
      // User 1 has bought stocks in 3 batches. Total: 9
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 1,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 3,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 5,
      },
      // User 2 has bought stocks in 2 batches. Total: 16
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: toWallet.address,
        quantity: 7,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: toWallet.address,
        quantity: 9,
      },
    ]);

    const { fromContractStockId, toContractStockId } = await splitTransferMerge({
      packageId: PACKAGE_ID,
      fromExecutor: fromWallet,
      toExecutor: toWallet,
      contractId,
      fromAddress: fromWallet.address,
      toAddress: toWallet.address,
      quantity: 2,
    });

    expect(await getQuantity(fromWallet, fromContractStockId)).toEqual(7);
    expect(await getQuantity(toWallet, toContractStockId)).toEqual(18);

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);
});
