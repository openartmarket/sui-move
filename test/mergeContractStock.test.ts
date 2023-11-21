import { beforeEach, describe, expect, it } from "vitest";

import { mergeContractStock } from "../src/mergeContractStock.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import type { Wallet } from "../src/Wallet.js";
import {
  ADMIN_CAP_ID,
  adminWallet,
  getQuantity,
  makeWallet,
  mintContractOptions,
} from "./test-helpers";

describe("mergeContractStock", () => {
  let contractId: string;
  let wallet: Wallet;
  beforeEach(async function () {
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet = await makeWallet();
  }, 20_000);

  it("should merge contract stocks", async () => {
    const {
      contractStockIds: [toContractStockId],
    } = await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet.address,
        quantity: 10,
      },
    ]);

    const {
      contractStockIds: [fromContractStockId],
    } = await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet.address,
        quantity: 10,
      },
    ]);

    await mergeContractStock(wallet, [
      {
        toContractStockId,
        fromContractStockId,
      },
    ]);

    expect(await getQuantity(wallet, toContractStockId)).toEqual(20);
    await expect(getQuantity(wallet, fromContractStockId)).rejects.toSatisfy((err) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(err.code).toEqual("deleted");
      return true;
    });
  }, 30_000);
});
