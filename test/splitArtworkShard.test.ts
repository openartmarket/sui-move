import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { USER1_PHRASE } from "../setup/src/config";
import { splitArtworkShard } from "../setup/src/split_artwork_shard";
import { mintArtworkOptions } from "./testdata";

describe("splitArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should split an artwork shard", async () => {
    const artworkShardId = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 10 });

    await splitArtworkShard(artworkShardId, 2);
  });
});
