import assert from "assert";

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

  it.only("should split an artwork shard", async () => {
    const artworkShardId = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 10 });
    console.log({artworkShardId});
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const splitArtworkShardId = await splitArtworkShard(artworkShardId, USER1_PHRASE, 2);
    console.log({splitArtworkShardId});
    assert.ok(splitArtworkShardId);
  });
});
