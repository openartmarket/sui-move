import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { getAvailableStock } from "../src/getAvailableStock";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER2_ADDRESS,
  USER3_ADDRESS,
} from "./test-helpers";

describe("mintContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  beforeEach(async () => {
    executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
      packageId: PACKAGE_ID,
    });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;
  });

  it("should issue new shares in batch", async () => {
    const { contractId: contractId2 } = await mintContract(executor, mintContractOptions);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: USER1_ADDRESS,
        quantity: 20,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId: contractId2,
        receiverAddress: USER1_ADDRESS,
        quantity: 10,
      },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: USER1_ADDRESS, quantity: 2 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: USER2_ADDRESS, quantity: 3 },
      { adminCapId: ADMIN_CAP_ID, contractId, receiverAddress: USER3_ADDRESS, quantity: 5 },
    ]);
    const sharesLeft = await getAvailableStock(client, contractId);
    const sharesLeft2 = await getAvailableStock(client, contractId2);
    assert.equal(sharesLeft, 490);
    assert.equal(sharesLeft2, 470);
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock(executor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 501,
          receiverAddress: USER1_ADDRESS,
        },
      ]),
    );
  });

  it("should issue remaining shares", async () => {
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 498,
        receiverAddress: USER1_ADDRESS,
      },
    ]);

    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 2,
        receiverAddress: USER1_ADDRESS,
      },
    ]);

    const sharesLeft = await getAvailableStock(client, contractId);
    assert.equal(sharesLeft, 0);

    await assert.rejects(
      mintContractStock(executor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          quantity: 1,
          receiverAddress: USER1_ADDRESS,
        },
      ]),
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        quantity: 150,
        receiverAddress: USER1_ADDRESS,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 250,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 98,
      },
    ]);
    const sharesLeft = await getAvailableStock(client, contractId);
    assert.equal(sharesLeft, 2);

    await assert.rejects(
      mintContractStock(executor, [
        {
          adminCapId: ADMIN_CAP_ID,
          contractId,
          receiverAddress: USER2_ADDRESS,
          quantity: 3,
        },
      ]),
    );
  }, 30_000);

  it("can give shares to OAM and owner", async () => {
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 150,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 50,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
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
