import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import { endRequestVoting } from "../src/end_request_voting";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContractStock } from "../src/mintContractStock";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  baseOptions,
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
    contractId = await mintContract(client, mintContractOptions);
    executor = new SuiExecutor({ client, signerPhrase: ADMIN_PHRASE, packageId: PACKAGE_ID });

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

  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
  }, 30_000);

  it("can vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
    const userVote = await vote(client, {
      contractId,
      voteRequest,
      packageId: PACKAGE_ID,
      voterAccount: USER1_PHRASE,
      choice: true,
    });
    assert.ok(userVote);
  });

  it("cannot double vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
    const userVote = await vote(client, {
      contractId,
      voteRequest,
      voterAccount: USER1_PHRASE,
      choice: true,
      ...baseOptions,
    });
    assert.ok(userVote);
    await assert.rejects(
      vote(client, {
        contractId,
        voteRequest,
        voterAccount: USER1_PHRASE,
        choice: true,
        ...baseOptions,
      }),
    );
  }, 30_000);

  it("cannot vote if not a shareholder", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
    await assert.rejects(
      vote(client, {
        contractId,
        voteRequest,
        voterAccount: USER3_PHRASE,
        packageId: PACKAGE_ID,
        choice: true,
      }),
    );
  });

  it("cannot vote if vote is closed", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
    const userVote = await vote(client, {
      contractId,
      voteRequest,
      voterAccount: USER1_PHRASE,
      choice: true,
      ...baseOptions,
    });
    assert.ok(userVote);
    const endVoteRequest = await endRequestVoting(client, {
      voteRequest,
      ...baseOptions,
    });
    assert.ok(endVoteRequest);
    await assert.rejects(
      vote(client, {
        contractId,
        voteRequest,
        voterAccount: USER1_PHRASE,
        choice: true,
        ...baseOptions,
      }),
    );
  }, 30_000);
});
