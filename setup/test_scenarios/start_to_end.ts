import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { endRequestVoting } from "../src/end_request_voting";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";

// WIP for start to end scenario
async function startToEndScenario() {
  // Mint an artwork
  let artwork = await mintArtwork(
    1000,
    10,
    100,
    "Mona Lisa",
    "Leonardo da Vinci",
    "1685548680595",
    "Choconta painting",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
  );
  console.log("Minted Artwork with id", artwork);
  if (!artwork) throw new Error("Could not mint artwork");

  // Create an artwork shard
  let artworkShard = await mintArtworkShard(artwork, 10);
  console.log("Minted Artwork Shard with id", artworkShard);
  if (!artworkShard) throw new Error("Could not mint artwork shard");

  // Create a vote request for the artwork
  let voteRequest = await createVoteRequest(
    artwork,
    "Request to sell artwork to Bob"
  );
  console.log("Created vote request with id", voteRequest);
  if (!voteRequest) throw new Error("Could not create vote request");

  // Vote for vote request
  await vote(artworkShard, voteRequest, true);

  // // End voting for vote request
  // await endRequestVoting(voteRequest);
}

startToEndScenario();
