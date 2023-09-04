import assert from "assert";
import { before, describe, it } from "mocha";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { endRequestVoting } from "../src/end_request_voting";
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
  before(async function () {
    this.timeout(30_000);
    contractId = await mintContract(client, mintContractOptions);
    await mintContractStock(client, {
      contractId,
      receiverAddress: ADMIN_ADDRESS,
      shares: 151,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 249,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER2_ADDRESS,
      shares: 100,
      ...baseOptions,
    });
  });

  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest(client, {
      contractId,
      request: "Request to sell contract to Museum",
      ...baseOptions,
    });
    assert.ok(voteRequest);
  }).timeout(30_000);

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
  }).timeout(30_000);

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
  }).timeout(30_000);
});
