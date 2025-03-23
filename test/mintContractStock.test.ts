import assert from "node:assert";

import { beforeEach, describe, expect, it } from "vitest";

import type { Wallet } from "../src/Wallet.js";
import { getQuantity } from "../src/getters.js";
import { mintContract } from "../src/mintContract.js";
import {
  type MintContractStockParams,
  findContractStock,
  mintContractStock,
} from "../src/mintContractStock.js";
import { ADMIN_CAP_ID, adminWallet, makeMintContractOptions, makeWallet } from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;

  let wallet1: Wallet;
  let wallet2: Wallet;

  beforeEach(async () => {
    const mintContractOptions = makeMintContractOptions();

    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet1 = await makeWallet();
    wallet2 = await makeWallet();
  }, 30_000);

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock(adminWallet, {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 501,
        receiverAddress: wallet1.address,
      }),
    );
  }, 30_000);

  it("should issue remaining shares", async () => {
    const sharesLeftBefore = await getQuantity(adminWallet.suiClient, contractId);
    expect(sharesLeftBefore).toEqual(500);

    await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      quantity: 498,
      receiverAddress: wallet1.address,
    });

    await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      quantity: 2,
      receiverAddress: wallet1.address,
    });

    const sharesLeftAfter = await getQuantity(adminWallet.suiClient, contractId);
    expect(sharesLeftAfter).toEqual(0);

    await assert.rejects(
      mintContractStock(adminWallet, {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 1,
        receiverAddress: wallet1.address,
      }),
    );
  }, 30_000);

  it("should not issue more shares than available", async () => {
    await assert.rejects(
      mintContractStock(adminWallet, {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet2.address,
        quantity: 501,
      }),
    );
  }, 30_000);

  it.skip("can set the outgoing sale price of the contract", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after contract is sold", async () => {
    assert.ok(false);
  });
});
