import assert from "assert";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { USER1_PHRASE } from "../src/config";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { getObject } from "./test-helpers";
import { mintArtworkOptions } from "./testdata";

describe("splitArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should split an artwork shard", async () => {
    const { artworkShardId } = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 10 });

    const splitShardId = await splitArtworkShard(artworkShardId, USER1_PHRASE, 2);

    // Get the shard and check that it has 2 shares
    const splitShard = await getObject(splitShardId)
    const oldShard = await getObject(artworkShardId)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, '2');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, '8');

  }).timeout(10_000);

  it("should split a split shard", async () => {
    const { artworkShardId } = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 12 });

    const splitShardId = await splitArtworkShard(artworkShardId, USER1_PHRASE, 5);
    const splitAgainShardId = await splitArtworkShard(splitShardId, USER1_PHRASE, 3);

    const oldShard = await getObject(artworkShardId)
    const splitShard = await getObject(splitShardId)
    const splitAgainShard = await getObject(splitAgainShardId)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, '7');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, '2');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitAgainShard.data.content.fields.shares, '3');

  }).timeout(10_000);

  it("should split a split shard", async () => {
    const { artworkShardId } = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 12 });

    const splitShardId1 = await splitArtworkShard(artworkShardId, USER1_PHRASE, 5);
    const splitShardId2 = await splitArtworkShard(artworkShardId, USER1_PHRASE, 3);

    const oldShard = await getObject(artworkShardId)
    const splitShard = await getObject(splitShardId1)
    const splitAgainShard = await getObject(splitShardId2)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, '4');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, '5');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitAgainShard.data.content.fields.shares, '3');

  }).timeout(10_000);
});
