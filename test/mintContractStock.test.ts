import assert from "node:assert";

import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  adminExecutor,
  getQuantity,
  mintContractOptions,
} from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;

  let user1: SuiAddress;
  let user2: SuiAddress;
  let user3: SuiAddress;
  beforeEach(async () => {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
    user2 = await newAddress();
    user3 = await newAddress();
  });

  it("should issue new shares in batch", async () => {
    const { contractId: contractId2 } = await mintContract(adminExecutor, mintContractOptions);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: user1.address,
        quantity: 20,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: user1.address,
        quantity: 10,
      },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: user1.address, quantity: 2 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: user2.address, quantity: 3 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: user3.address, quantity: 5 },
    ]);

    expect(await getQuantity(adminExecutor.suiClient, contractId)).toEqual(490);
    expect(await getQuantity(adminExecutor.suiClient, contractId2)).toEqual(470);
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock(adminExecutor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 501,
          receiverAddress: user1.address,
        },
      ]),
    );
  });

  it("should issue remaining shares", async () => {
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 498,
        receiverAddress: user1.address,
      },
    ]);

    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 2,
        receiverAddress: user1.address,
      },
    ]);

    const sharesLeft = await getQuantity(adminExecutor.suiClient, contractId);
    assert.equal(sharesLeft, 0);

    await assert.rejects(
      mintContractStock(adminExecutor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 1,
          receiverAddress: user1.address,
        },
      ]),
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 150,
        receiverAddress: user1.address,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 250,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 98,
      },
    ]);

    expect(await getQuantity(adminExecutor.suiClient, contractId)).toEqual(2);

    await assert.rejects(
      mintContractStock(adminExecutor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          receiverAddress: user2.address,
          quantity: 3,
        },
      ]),
    );
  }, 30_000);

  it("can give shares to OAM and owner", async () => {
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 150,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 50,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
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
