import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import { endRequestVoting } from "../src/end_request_voting";
import { mintContractStock } from "../src/mint_contract_stock";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";
import {
  ADMIN_ADDRESS,
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
  const client = getClient();
  let contractId: string;

  beforeEach(async function () {
    contractId = await mintContract(client, mintContractOptions);
    await mintContractStock(client, {
      contractId,
      receiverAddress: ADMIN_ADDRESS,
      quantity: 151,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 249,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER2_ADDRESS,
      quantity: 100,
      ...baseOptions,
    });
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
