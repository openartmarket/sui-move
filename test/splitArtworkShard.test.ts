import assert from "assert";

import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { USER1_PHRASE } from "../setup/src/config";
import { splitArtworkShard } from "../setup/src/split_artwork_shard";
import { getObject } from "./test-helpers";
import { mintArtworkOptions } from "./testdata";

describe("splitArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it.only("should split an artwork shard", async () => {
    const { artworkShardId } = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 10 });

    const splitShardId = await splitArtworkShard(artworkShardId, USER1_PHRASE, 2);

    // Get the shard and check that it has 2 shares
    const newShard = await getObject(splitShardId)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(newShard.data.content.fields.shares, '2');

    const oldShard = await getObject(artworkShardId)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, '8');

  }).timeout(30_000);
});
