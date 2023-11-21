import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { endMotion } from "../src";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { startMotion } from "../src/startMotion";
import { vote } from "../src/vote";
import type { Wallet } from "../src/wallet";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  adminWallet,
  makeWallet,
  mintContractOptions,
} from "./test-helpers";

describe("DAO Voting structure", () => {
  let contractId: string;
  let user1: Wallet;
  let user2: Wallet;
  let user3: Wallet;

  beforeEach(async function () {
    const res = await mintContract(adminWallet.executor, mintContractOptions);
    contractId = res.contractId;

    user1 = await makeWallet();
    user2 = await makeWallet();
    user3 = await makeWallet();

    await mintContractStock(adminWallet.executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 151,
      },
    ]);
    await mintContractStock(adminWallet.executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 249,
      },
    ]);
    await mintContractStock(adminWallet.executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 100,
      },
    ]);
  }, 30_000);

  it("can start a motion", async () => {
    const voteRequest = await startMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });
    assert.ok(voteRequest);
  }, 30_000);

  it("can vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await vote(user1.executor, {
      contractId,
      motionId,
      choice: true,
    });
  });

  it("cannot double vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await vote(user1.executor, {
      contractId,
      motionId,
      choice: true,
    });
    await assert.rejects(
      vote(user1.executor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);

  it("cannot vote if not a shareholder", async () => {
    const { motionId } = await startMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await assert.rejects(
      vote(user3.executor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  });

  it("cannot vote if motion is closed", async () => {
    const { motionId } = await startMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await endMotion(adminWallet.executor, {
      adminCapId: ADMIN_CAP_ID,
      motionId,
    });

    await assert.rejects(
      vote(user1.executor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);
});
