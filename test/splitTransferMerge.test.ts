import { beforeEach, describe, expect, it } from "vitest";

import { getWalletQuantity } from "../src/getters.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { splitTransferMerge } from "../src/splitTransferMerge.js";
import {
  ADMIN_CAP_ID,
  adminWallet,
  makeWallet,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers.js";

describe("splitTransferMerge", () => {
  let contractId: string;
  beforeEach(async () => {
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;
  }, 30_000);

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
      fromWallet: fromWallet,
      toWallet: toWallet,
      contractId,
      quantity: 2,
    });

    expect(await getWalletQuantity(fromWallet, fromContractStockId)).toEqual(7);
    expect(await getWalletQuantity(toWallet, toContractStockId)).toEqual(18);

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);

  it.only("should not split when stock is already the size of the transfer quantity", async () => {
    const fromWallet = await makeWallet();
    const toWallet = await makeWallet();

    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 3,
      },
    ]);

    const { fromContractStockId, toContractStockId } = await splitTransferMerge({
      packageId: PACKAGE_ID,
      fromWallet,
      toWallet,
      contractId,
      quantity: 3,
    });

    expect(fromContractStockId).toEqual(toContractStockId);
    expect(await getWalletQuantity(toWallet, toContractStockId)).toEqual(3);

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);
});
