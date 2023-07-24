import assert from "assert";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { ADMIN_PHRASE, USER1_PHRASE, USER2_PHRASE } from "../src/config";
import {
  findObjectIdInOwnedObjectList,
  OwnedObjectList,
} from "../src/findObjectIdWithOwnerAddress";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { transferArtworkShard } from "../src/transfer_artwork_shard";
import { getObject, getOwnedObjects } from "./test-helpers";
import { mintArtworkOptions } from "./testdata";

describe("transferArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should mint a shard and then transfer it", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 12,
    });

    await transferArtworkShard({
      artworkId,
      artworkShardId,
      signerPhrase: USER1_PHRASE,
      recieverPhrase: USER2_PHRASE,
    });

    const transferredShard = await getObject(artworkShardId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredShard.data.content.fields.shares, "12");
  }).timeout(10_000);

  it("should split a split shard and transfer it to new owner", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 12,
    });

    const splitShardId1 = await splitArtworkShard({
      artworkShardId,
      signerPhrase: USER1_PHRASE,
      shares: 5,
    });

    const oldShard = await getObject(artworkShardId);
    const splitShard = await getObject(splitShardId1.artworkShardId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(oldShard.data.content.fields.shares, "7");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(splitShard.data.content.fields.shares, "5");

    const transferArtworkShardResponse = await transferArtworkShard({
      artworkId,
      artworkShardId: splitShardId1.artworkShardId,
      signerPhrase: USER1_PHRASE,
      recieverPhrase: USER2_PHRASE,
    });

    const ownedObjects = await getOwnedObjects(transferArtworkShardResponse.address);
    const transferredShard = findObjectIdInOwnedObjectList(
      ownedObjects as OwnedObjectList,
      splitShardId1.artworkShardId
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredShard.data.objectId, splitShardId1.artworkShardId);
  }).timeout(10_000);
});
