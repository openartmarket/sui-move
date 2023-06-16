import { mintArtwork } from "../setup/src/artwork";
import { USER1_PHRASE } from "../setup/src/config";
import { mintArtworkShard } from "../setup/src/mintArtworkShard";
import { splitArtworkShard } from "../setup/src/splitArtworkShard";
import { mintArtworkOptions } from "./testdata";

describe('splitArtworkShard', () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it.only('should split an artwork shard', async () => {
    const artworkShardId = await mintArtworkShard({artworkId, phrase: USER1_PHRASE, shares: 10});

    await splitArtworkShard(artworkShardId, 2);
  })
})