import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import type { Wallet } from "../src/Wallet.js";
import { endMotion } from "../src/endMotion.js";
import { mintContract } from "../src/mintContract.js";
import { mintContractStock } from "../src/mintContractStock.js";
import { startMotion } from "../src/startMotion.js";
import { vote } from "../src/vote.js";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  adminWallet,
  makeMintContractOptions,
  makeWallet,
} from "./test-helpers.js";

describe("DAO Voting structure", () => {
  let contractId: string;
  let user1: Wallet;
  let user2: Wallet;
  let user3: Wallet;

  beforeEach(async () => {
    const mintContractOptions = makeMintContractOptions();
    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    user1 = await makeWallet();
    user2 = await makeWallet();
    user3 = await makeWallet();

    await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: ADMIN_ADDRESS,
      quantity: 151,
    });
    await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: user1.address,
      quantity: 249,
    });
    await mintContractStock(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      receiverAddress: user2.address,
      quantity: 100,
    });
  }, 30_000);

  it("can start a motion", async () => {
    const voteRequest = await startMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });
    assert.ok(voteRequest);
  }, 30_000);

  it("can vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await vote(user1, {
      contractId,
      motionId,
      choice: true,
    });
  }, 30_000);

  it("cannot double vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await vote(user1, {
      contractId,
      motionId,
      choice: true,
    });
    await assert.rejects(
      vote(user1, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);

  it("cannot vote if not a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await assert.rejects(
      vote(user3, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);

  it("cannot vote if motion is closed", async () => {
    const { motionId } = await startMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await endMotion(adminWallet, {
      adminCapId: ADMIN_CAP_ID,
      motionId,
    });

    await assert.rejects(
      vote(user1, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);
});
