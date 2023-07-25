import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { endRequestVoting } from "../src/end_request_voting";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";
import { mintContractOptions } from "./test-data";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  PACKAGE_ID,
  SUI_NETWORK,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER3_PHRASE,
} from "./test-helpers";

describe("DAO Voting structure", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: ADMIN_ADDRESS,
      shares: 151,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 249,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 100,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
  });

  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest({
      contractId,
      request: "Request to sell contract to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
  });

  it("can vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest({
      contractId,
      request: "Request to sell contract to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      contractId,
      voteRequest,
      packageId: PACKAGE_ID,
      voterAccount: USER1_PHRASE,
      choice: true,
      network: SUI_NETWORK,
    });
    assert.ok(userVote);
  });

  it("cannot double vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest({
      contractId,
      request: "Request to sell contract to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      contractId,
      voteRequest,
      packageId: PACKAGE_ID,
      voterAccount: USER1_PHRASE,
      choice: true,
      network: SUI_NETWORK,
    });
    assert.ok(userVote);
    await assert.rejects(
      vote({
        contractId,
        voteRequest,
        packageId: PACKAGE_ID,
        voterAccount: USER1_PHRASE,
        choice: true,
        network: SUI_NETWORK,
      })
    );
  });

  it("cannot vote if not a shareholder", async () => {
    const voteRequest = await createVoteRequest({
      contractId,
      request: "Request to sell contract to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    await assert.rejects(
      vote({
        contractId,
        voteRequest,
        voterAccount: USER3_PHRASE,
        packageId: PACKAGE_ID,
        choice: true,
        network: SUI_NETWORK,
      })
    );
  });

  it("cannot vote if vote is closed", async () => {
    const voteRequest = await createVoteRequest({
      contractId,
      request: "Request to sell contract to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      contractId,
      voteRequest,
      packageId: PACKAGE_ID,
      voterAccount: USER1_PHRASE,
      choice: true,
      network: SUI_NETWORK,
    });
    assert.ok(userVote);
    const endVoteRequest = await endRequestVoting({
      voteRequest,
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(endVoteRequest);
    await assert.rejects(
      vote({
        contractId,
        voteRequest,
        packageId: PACKAGE_ID,
        voterAccount: USER1_PHRASE,
        choice: true,
        network: SUI_NETWORK,
      })
    );
  });
});
