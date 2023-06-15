import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { user1 } from "../src/config";
import { endRequestVoting } from "../src/end_request_voting";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";

// WIP for start to end scenario
async function startToEndScenario() {
  // Admin mints an artwork
  let artwork = await mintArtwork({
    totalSupply: 1000,
    ingoingPrice: 10,
    multiplier: 2,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    creationDate: "1685548680595",
    description: "Choconta painting",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
  }
  );
  if (!artwork) throw new Error("Could not mint artwork");

  // Admin creates an artwork shard and sends to user
  let artworkShard = await mintArtworkShard(artwork, user1, 10);
  if (!artworkShard) throw new Error("Could not mint artwork shard");

  // Split artwork shard
  await splitArtworkShard(artwork, artworkShard, 2);
  
  // Admin reates a vote request for the artwork
  let voteRequest = await createVoteRequest(
    artwork,
    "Request to sell artwork to Bob"
  );
  if (!voteRequest) throw new Error("Could not create vote request");

  // User votes for vote request
  await vote(artwork, voteRequest, user1, true);

  // End voting for vote request
  await endRequestVoting(voteRequest);
}

startToEndScenario();
