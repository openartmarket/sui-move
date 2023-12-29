import assert from "node:assert";

import { beforeEach, describe, expect, it } from "vitest";

import { getQuantity } from "../src/getters.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import type { Wallet } from "../src/Wallet.js";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  adminWallet,
  makeWallet,
  mintContractOptions,
} from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;

  let wallet1: Wallet;
  let wallet2: Wallet;
  let wallet3: Wallet;
  beforeEach(async () => {
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet1 = await makeWallet();
    wallet2 = await makeWallet();
    wallet3 = await makeWallet();
  }, 30_000);

  it("should issue new shares in batch", async () => {
    const { contractId: contractId2 } = await mintContract(adminWallet, mintContractOptions);
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: wallet1.address,
        quantity: 20,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: wallet1.address,
        quantity: 10,
      },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: wallet1.address, quantity: 2 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: wallet2.address, quantity: 3 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: wallet3.address, quantity: 5 },
    ]);

    expect(await getQuantity(adminWallet.suiClient, contractId)).toEqual(490);
    expect(await getQuantity(adminWallet.suiClient, contractId2)).toEqual(470);
  }, 30_000);

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock(adminWallet, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 501,
          receiverAddress: wallet1.address,
        },
      ]),
    );
  }, 30_000);

  it("should issue remaining shares", async () => {
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 498,
        receiverAddress: wallet1.address,
      },
    ]);

    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 2,
        receiverAddress: wallet1.address,
      },
    ]);

    const sharesLeft = await getQuantity(adminWallet.suiClient, contractId);
    assert.equal(sharesLeft, 0);

    await assert.rejects(
      mintContractStock(adminWallet, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 1,
          receiverAddress: wallet1.address,
        },
      ]),
    );
  }, 30_000);

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 150,
        receiverAddress: wallet1.address,
      },
    ]);
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet2.address,
        quantity: 250,
      },
    ]);
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet1.address,
        quantity: 98,
      },
    ]);

    expect(await getQuantity(adminWallet.suiClient, contractId)).toEqual(2);

    await assert.rejects(
      mintContractStock(adminWallet, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          receiverAddress: wallet2.address,
          quantity: 3,
        },
      ]),
    );
  }, 30_000);

  it("can give shares to OAM and owner", async () => {
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 150,
      },
    ]);
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet1.address,
        quantity: 50,
      },
    ]);
    await mintContractStock(adminWallet, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: wallet2.address,
        quantity: 1,
      },
    ]);
  }, 30_000);

  it.skip("can set the outgoing sale price of the contract", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after contract is sold", async () => {
    assert.ok(false);
  });
});
