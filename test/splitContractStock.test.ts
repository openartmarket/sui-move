import { beforeEach, describe, expect, it } from "vitest";

import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/splitContractStock";
import type { Wallet } from "../src/wallet";
import {
  ADMIN_CAP_ID,
  adminExecutor,
  getQuantity,
  makeWallet,
  mintContractOptions,
} from "./test-helpers";

describe("splitContractStock", () => {
  let contractId: string;
  let wallet: Wallet;
  beforeEach(async function () {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    wallet = await makeWallet();
  }, 20_000);

  it("should split an contract stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet.address,
        quantity: 10,
      },
    ]);

    const { splitContractStockId } = await splitContractStock(wallet.executor, {
      contractStockId,
      quantity: 2,
    });

    expect(await getQuantity(wallet, splitContractStockId)).toEqual(2);
    expect(await getQuantity(wallet, contractStockId)).toEqual(8);
  }, 30_000);

  it("should split a split stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet.address,
        quantity: 12,
      },
    ]);

    const { splitContractStockId } = await splitContractStock(wallet.executor, {
      contractStockId,
      quantity: 5,
    });
    const { splitContractStockId: splitAgainContractStockId } = await splitContractStock(
      wallet.executor,
      {
        contractStockId: splitContractStockId,
        quantity: 3,
      },
    );

    expect(await getQuantity(wallet, contractStockId)).toEqual(7);
    expect(await getQuantity(wallet, splitContractStockId)).toEqual(2);
    expect(await getQuantity(wallet, splitAgainContractStockId)).toEqual(3);
  }, 30_000);
});
