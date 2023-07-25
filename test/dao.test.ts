import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { PACKAGE_ID } from "../src/config";
import { endRequestVoting } from "../src/end_request_voting";
import { Currency } from "../src/types";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER3_PHRASE,
} from "./test-helpers";

const artworkOptions = {
  signerPhrase: ADMIN_PHRASE,
  packageId: PACKAGE_ID,
  adminCapId: ADMIN_CAP_ID,
  totalSupply: 500,
  sharePrice: 10,
  multiplier: 100,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  creationDate: "1685548680595",
  description: "Choconta painting",
  currency: "NOK" as Currency,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
};

describe("DAO Voting structure", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(artworkOptions);
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: ADMIN_ADDRESS,
      shares: 151,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 249,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 100,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
  });

  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest({
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
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
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
      voteRequest,
      voterAccount: USER1_PHRASE,
      choice: true,
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
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
      voteRequest,
      voterAccount: USER1_PHRASE,
      choice: true,
    });
    assert.ok(userVote);
    await assert.rejects(
      vote({ artworkId, voteRequest, voterAccount: USER1_PHRASE, choice: true })
    );
  });

  it("cannot vote if not a shareholder", async () => {
    const voteRequest = await createVoteRequest({
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
    });
    assert.ok(voteRequest);
    await assert.rejects(
      vote({ artworkId, voteRequest, voterAccount: USER3_PHRASE, choice: true })
    );
  });

  it("cannot vote if vote is closed", async () => {
    const voteRequest = await createVoteRequest({
      artworkId,
      request: "Request to sell artwork to Museum",
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
    });
    assert.ok(voteRequest);
    const userVote = await vote({
      artworkId,
      voteRequest,
      voterAccount: USER1_PHRASE,
      choice: true,
    });
    assert.ok(userVote);
    const endVoteRequest = await endRequestVoting({
      voteRequest,
      packageId: PACKAGE_ID,
      signerPhrase: ADMIN_PHRASE,
      adminCapId: ADMIN_CAP_ID,
    });
    assert.ok(endVoteRequest);
    await assert.rejects(
      vote({ artworkId, voteRequest, voterAccount: USER1_PHRASE, choice: true })
    );
  });
});
