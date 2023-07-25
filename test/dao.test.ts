import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { endRequestVoting } from "../src/end_request_voting";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";
import { mintArtworkOptions } from "./test-data";
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
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: ADMIN_ADDRESS,
      shares: 151,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 249,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintArtworkShard({
      artworkId,
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
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
  });

  it("can vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest({
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
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
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
      voteRequest,
      packageId: PACKAGE_ID,
      voterAccount: USER1_PHRASE,
      choice: true,
      network: SUI_NETWORK,
    });
    assert.ok(userVote);
    await assert.rejects(
      vote({
        artworkId,
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
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    await assert.rejects(
      vote({
        artworkId,
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
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
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
        artworkId,
        voteRequest,
        packageId: PACKAGE_ID,
        voterAccount: USER1_PHRASE,
        choice: true,
        network: SUI_NETWORK,
      })
    );
  });
});
