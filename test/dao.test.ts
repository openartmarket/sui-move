import assert from "assert";

import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { ADMIN_PHRASE, USER1_PHRASE, USER2_PHRASE, USER3_PHRASE } from "../setup/src/config";
import { endRequestVoting } from "../setup/src/end_request_voting";
import { vote } from "../setup/src/vote";
import { createVoteRequest } from "../setup/src/vote_request";

const artworkOptions = {
  totalSupply: 500,
  ingoingPrice: 10,
  multiplier: 100,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  creationDate: "1685548680595",
  description: "Choconta painting",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
};

describe("DAO Voting structure", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(artworkOptions);

    await mintArtworkShard({ artworkId, phrase: ADMIN_PHRASE, shares: 151 });
    await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 249 });
    await mintArtworkShard({ artworkId, phrase: USER2_PHRASE, shares: 100 });
  });

  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest(artworkId, "Request to sell artwork to Museum");
    assert.ok(voteRequest);
  });

  it("can vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest(artworkId, "Request to sell artwork to Museum");
    assert.ok(voteRequest);
    const userVote = await vote(artworkId, voteRequest, USER1_PHRASE, true);
    assert.ok(userVote);
  });

  it("cannot double vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest(artworkId, "Request to sell artwork to Museum");
    assert.ok(voteRequest);
    const userVote = await vote(artworkId, voteRequest, USER1_PHRASE, true);
    assert.ok(userVote);
    await assert.rejects(vote(artworkId, voteRequest, USER1_PHRASE, true));
  });

  it("cannot vote if not a shareholder", async () => {
    const voteRequest = await createVoteRequest(artworkId, "Request to sell artwork to Museum");
    assert.ok(voteRequest);
    await assert.rejects(vote(artworkId, voteRequest, USER3_PHRASE, true));
  });

  it("cannot vote if vote is closed", async () => {
    const voteRequest = await createVoteRequest(artworkId, "Request to sell artwork to Museum");
    assert.ok(voteRequest);
    const userVote = await vote(artworkId, voteRequest, USER1_PHRASE, true);
    assert.ok(userVote);
    const endVoteRequest = await endRequestVoting(voteRequest);
    assert.ok(endVoteRequest);
    await assert.rejects(vote(artworkId, voteRequest, USER1_PHRASE, true));
  });
});
