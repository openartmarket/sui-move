import assert from "assert";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID, USER1_PHRASE } from "../src/config";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { getObject } from "./test-helpers";
import { mintArtworkOptions } from "./testdata";

describe("splitArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should split an artwork shard", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 10,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const splitShardId = await splitArtworkShard({
      artworkShardId,
      signerPhrase: USER1_PHRASE,
      shares: 2,
      packageId: PACKAGE_ID,
    });

    // Get the shard and check that it has 2 shares
    const splitShard = await getObject(splitShardId.artworkShardId);
    const oldShard = await getObject(artworkShardId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, "2");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, "8");
  }).timeout(10_000);

  it("should split a split shard", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const splitShardId = await splitArtworkShard({
      artworkShardId,
      signerPhrase: USER1_PHRASE,
      shares: 5,
      packageId: PACKAGE_ID,
    });
    const splitAgainShardId = await splitArtworkShard({
      artworkShardId: splitShardId.artworkShardId,
      signerPhrase: USER1_PHRASE,
      shares: 3,
      packageId: PACKAGE_ID,
    });

    const oldShard = await getObject(artworkShardId);
    const splitShard = await getObject(splitShardId.artworkShardId);
    const splitAgainShard = await getObject(splitAgainShardId.artworkShardId);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, "7");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, "2");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitAgainShard.data.content.fields.shares, "3");
  }).timeout(10_000);
});
