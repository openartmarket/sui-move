import { beforeEach, describe, expect, it } from "vitest";

import { getContractStocks } from "../src/getContractStocks";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { transferContractStock } from "../src/transferContractStock";
import type { Wallet } from "../src/wallet";
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
    const res = await mintContract(adminWallet.executor, mintContractOptions);
    contractId = res.contractId;

    fromWallet = await makeWallet();
    toWallet = await makeWallet();
  });

  it("should transfer ownership", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminWallet.executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: fromWallet.address,
        quantity: 12,
      },
    ]);

    await transferContractStock(fromWallet.executor, {
      contractId,
      contractStockId,
      toAddress: toWallet.address,
    });

    const contractStocks = await getContractStocks({
      suiClient: fromWallet.executor.suiClient,
      owner: toWallet.address,
      contractId,
      packageId: PACKAGE_ID,
    });
    expect(contractStocks).toHaveLength(1);
    expect(contractStocks[0].objectId).toEqual(contractStockId);
  }, 30_000);
});
