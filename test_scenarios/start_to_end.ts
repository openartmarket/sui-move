import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID, USER1_PHRASE } from "../src/config";
import { endRequestVoting } from "../src/end_request_voting";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { vote } from "../src/vote";
import { createVoteRequest } from "../src/vote_request";

// WIP for start to end scenario
async function startToEndScenario() {
  // Admin mints an artwork
  const artworkId = await mintArtwork({
    signerPhrase: ADMIN_PHRASE,
    packageId: PACKAGE_ID,
    adminCapId: ADMIN_CAP_ID,
    totalSupply: 1000,
    sharePrice: 10,
    multiplier: 2,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    creationDate: "1685548680595",
    description: "Choconta painting",
    currency: "NOK",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
  });

  // Admin creates an artwork shard and sends to user
  const { artworkShardId } = await mintArtworkShard({artworkId, signerPhrase: ADMIN_PHRASE, recieverPhrase: USER1_PHRASE, shares: 10});

  // Split artwork shard
  await splitArtworkShard({artworkShardId, signerPhrase: USER1_PHRASE, shares: 2});
  
  // Admin reates a vote request for the artwork
  const voteRequest = await createVoteRequest(
    artworkId,
    "Request to sell artwork to Bob"
  );
  if (!voteRequest) throw new Error("Could not create vote request");

  // User votes for vote request
  await vote(artworkId, voteRequest, USER1_PHRASE, true);

  // End voting for vote request
  await endRequestVoting(voteRequest);
}

startToEndScenario();
