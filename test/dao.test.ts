import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { endMotion } from "../src";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { startMotion } from "../src/startMotion";
import { vote } from "../src/vote";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER3_PHRASE,
} from "./test-helpers";

describe("DAO Voting structure", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;

  beforeEach(async function () {
    executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
      packageId: PACKAGE_ID,
    });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;

    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: ADMIN_ADDRESS,
        quantity: 151,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 249,
      },
    ]);
    await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 100,
      },
    ]);
  }, 30_000);

  it("can start a motion", async () => {
    const voteRequest = await startMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });
    assert.ok(voteRequest);
  }, 30_000);

  it("can vote as a shareholder", async () => {
    const { motionId } = await startMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
      packageId: PACKAGE_ID,
    });
    await vote(voterExecutor, {
      contractId,
      motionId,
      choice: true,
    });
  });

  it("cannot double vote as a shareholder", async () => {
    const { motionId } = await startMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
      packageId: PACKAGE_ID,
    });
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
    const { motionId } = await startMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    const voterExecutor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER3_PHRASE),
      packageId: PACKAGE_ID,
    });

    await assert.rejects(
      vote(voterExecutor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  });

  it("cannot vote if motion is closed", async () => {
    const { motionId } = await startMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      motion: "Request to sell artwork to Museum",
    });

    await endMotion(executor, {
      adminCapId: ADMIN_CAP_ID,
      motionId,
    });

    const voterExecutor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
      packageId: PACKAGE_ID,
    });

    await assert.rejects(
      vote(voterExecutor, {
        contractId,
        motionId,
        choice: true,
      }),
    );
  }, 30_000);
});
