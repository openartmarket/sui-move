import { beforeEach, describe, expect, it } from "vitest";

import type { Wallet } from "../src/Wallet.js";
import { getWalletQuantity } from "../src/getters.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { splitContractStock } from "../src/splitContractStock.js";
import { ADMIN_CAP_ID, adminWallet, makeMintContractOptions, makeWallet } from "./test-helpers";

describe("splitContractStock", () => {
  let contractId: string;
  let wallet: Wallet;

  beforeEach(async () => {
    const mintContractOptions = makeMintContractOptions();
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet = await makeWallet();
  }, 30_000);

  it("should split a stock", async () => {
    const { contractStockId } = await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: wallet.address,
      quantity: 10,
    });

    const { splitContractStockId } = await splitContractStock(wallet, {
      contractStockId,
      quantity: 2,
    });

    expect(await getWalletQuantity(wallet, splitContractStockId)).toEqual(2);
    expect(await getWalletQuantity(wallet, contractStockId)).toEqual(8);
  }, 30_000);

  it("should split a split stock", async () => {
    const { contractStockId } = await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: wallet.address,
      quantity: 12,
    });

    const { splitContractStockId } = await splitContractStock(wallet, {
      contractStockId,
      quantity: 5,
    });
    const { splitContractStockId: splitAgainContractStockId } = await splitContractStock(wallet, {
      contractStockId: splitContractStockId,
      quantity: 3,
    });

    expect(await getWalletQuantity(wallet, contractStockId)).toEqual(7);
    expect(await getWalletQuantity(wallet, splitContractStockId)).toEqual(2);
    expect(await getWalletQuantity(wallet, splitAgainContractStockId)).toEqual(3);
  }, 30_000);
});
