import assert from "assert";

import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { USER1_PHRASE } from "../setup/src/config";
import { provider } from "../setup/src/helpers";
import { splitArtworkShard } from "../setup/src/split_artwork_shard";
import { mintArtworkOptions } from "./testdata";

describe("splitArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it.only("should split an artwork shard", async () => {
    const { artworkShardId, digest } = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 10 });

    // await provider.waitForTransactionBlock({ 
    //   timeout: 20000, 
    //   digest, 
    //   options: { showEffects: true }, 
    // }); 

    await new Promise((resolve) => setTimeout(resolve, 5_000));
    await splitArtworkShard(artworkShardId, USER1_PHRASE, 2);
  }).timeout(30_000);
});
