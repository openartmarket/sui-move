import assert from "assert";
import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { adminPhrase, user1, user2, user3 } from "../setup/src/config";
import { createVoteRequest } from "../setup/src/vote_request";
import { vote } from "../setup/src/vote";
import { endRequestVoting } from "../setup/src/end_request_voting";

const artworkOptions = {
  totalSupply: 500,
  ingoingPrice: 10,
  outgoingPrice: 100,
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
    const txn = await mintArtwork(artworkOptions);
    if (!txn) throw new Error("Could not mint artwork");
    artworkId = txn;
    const sale1 = await mintArtworkShard(artworkId, adminPhrase, 151);
    assert.ok(sale1);
    const sale2 = await mintArtworkShard(artworkId, user1, 249);
    assert.ok(sale2);
    const sale3 = await mintArtworkShard(artworkId, user2, 100);
    assert.ok(sale3);
  });
  it("can start a voting session", async () => {
    const voteRequest = await createVoteRequest(
      artworkId,
      "Request to sell artwork to Museum"
    );
    assert.ok(voteRequest);
  });
  it("can vote as a shareholder", async () => {
    const voteRequest = await createVoteRequest(
      artworkId,
      "Request to sell artwork to Museum"
    );
    assert.ok(voteRequest);
    const userVote = await vote(artworkId, voteRequest, user1, true);
    assert.ok(userVote);
  });
  it("cannot vote if not a shareholder", async () => {
    const voteRequest = await createVoteRequest(
      artworkId,
      "Request to sell artwork to Museum"
    );
    assert.ok(voteRequest);
    await assert.rejects(vote(artworkId, voteRequest, user3, true));
  });
  it("cannot vote if vote is closed", async () => {
    const voteRequest = await createVoteRequest(
      artworkId,
      "Request to sell artwork to Museum"
    );
    assert.ok(voteRequest);
    const userVote = await vote(artworkId, voteRequest, user1, true);
    assert.ok(userVote);
    const endVoteRequest = await endRequestVoting(voteRequest);
    assert.ok(endVoteRequest);
    await assert.rejects(vote(artworkId, voteRequest, user1, true));
  });
});
