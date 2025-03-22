import { beforeEach, describe, expect, it } from "vitest";

import type { Wallet } from "../src/Wallet.js";
import { getWalletQuantity } from "../src/getters.js";
import { mergeContractStock } from "../src/mergeContractStock.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { ADMIN_CAP_ID, adminWallet, makeMintContractOptions, makeWallet } from "./test-helpers";

describe("mergeContractStock", () => {
  let contractId: string;
  let wallet: Wallet;
  beforeEach(async () => {
    const mintContractOptions = makeMintContractOptions();
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet = await makeWallet();
  }, 30_000);

  it("should merge contract stocks", async () => {
    const { contractStockId: toContractStockId } = await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: wallet.address,
      quantity: 9,
    });

    const { contractStockId: fromContractStockId } = await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: wallet.address,
      quantity: 11,
    });

    await mergeContractStock(wallet, [
      {
        toContractStockId,
        fromContractStockId,
      },
    ]);

    expect(await getWalletQuantity(wallet, toContractStockId)).toEqual(20);
    await expect(getWalletQuantity(wallet, fromContractStockId)).rejects.toSatisfy((err) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(err.code).toEqual("deleted");
      return true;
    });
  }, 30_000);
});
