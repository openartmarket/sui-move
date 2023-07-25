import assert from "assert";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { mergeArtworkShard } from "../src/merge_artwork_shard";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getObject,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
} from "./test-helpers";
import { mintArtworkOptions } from "./testdata";

describe("mergeArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should merge artwork shards", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    const { artworkShardId: artworkShard2Id } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const mergeArtworkShards = await mergeArtworkShard({
      artworkShard1Id: artworkShardId,
      artworkShard2Id,
      signerPhrase: USER1_PHRASE,
      packageId: PACKAGE_ID,
    });
    const burnedShard = await getObject(artworkShard2Id);
    const newShard = await getObject(mergeArtworkShards.artworkShardId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(newShard.data.content.fields.shares, "20");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(burnedShard.error.code, "deleted");
  });
});
