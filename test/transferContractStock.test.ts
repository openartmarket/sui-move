import { beforeEach, describe, expect, it } from "vitest";

import { getContractStocks } from "../src/getContractStocks.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { transferContractStock } from "../src/transferContractStock.js";
import type { Wallet } from "../src/Wallet.js";
import {
  ADMIN_CAP_ID,
  adminWallet,
  makeWallet,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers";

describe("transferContractStock", () => {
  let contractId: string;
  let fromWallet: Wallet;
  let toWallet: Wallet;
  beforeEach(async () => {
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    fromWallet = await makeWallet();
    toWallet = await makeWallet();
  }, 30_000);

  it("should transfer ownership", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 12,
      },
    ]);

    await transferContractStock(fromWallet, {
      contractId,
      contractStockId,
      toAddress: toWallet.address,
    });

    const contractStocks = await getContractStocks({
      suiClient: fromWallet.suiClient,
      owner: toWallet.address,
      contractId,
      packageId: PACKAGE_ID,
    });
    expect(contractStocks).toHaveLength(1);
    expect(contractStocks[0].objectId).toEqual(contractStockId);
  }, 30_000);
});
