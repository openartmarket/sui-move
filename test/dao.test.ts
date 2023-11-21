import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import type { SuiAddress } from "../src";
import { endMotion, newAddress } from "../src";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { startMotion } from "../src/startMotion";
import { vote } from "../src/vote";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  adminExecutor,
  mintContractOptions,
  newUserExecutor,
} from "./test-helpers";

describe("DAO Voting structure", () => {
  let contractId: string;
  let user1: SuiAddress;
  let user2: SuiAddress;
  let user3: SuiAddress;

  beforeEach(async function () {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
    user2 = await newAddress();
    user3 = await newAddress();

    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 151,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 249,
      },
    ]);
    await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 100,
      },
    ]);
  }, 30_000);

  it("can start a motion", async () => {
    const voteRequest = await startMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });
    assert.ok(voteRequest);
  }, 30_000);

  it("can vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = newUserExecutor(user1);
    await vote(voterExecutor, {
      contractId,
      motionId,
      choice: true,
    });
  });

  it("cannot double vote as a shareholder", async () => {
    const { motionId } = await startMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = newUserExecutor(user1);
    await vote(voterExecutor, {
      contractId,
      motionId,
      choice: true,
    });
    await assert.rejects(
      vote(voterExecutor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);

  it("cannot vote if not a shareholder", async () => {
    const { motionId } = await startMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = newUserExecutor(user3);

    await assert.rejects(
      vote(voterExecutor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  });

  it("cannot vote if motion is closed", async () => {
    const { motionId } = await startMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await endMotion(adminExecutor, {
      adminCapId: ADMIN_CAP_ID,
      motionId,
    });

    const voterExecutor = newUserExecutor(user1);

    await assert.rejects(
      vote(voterExecutor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);
});
