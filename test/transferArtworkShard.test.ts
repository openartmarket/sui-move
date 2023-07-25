import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { OwnedObjectList } from "../src";
import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { findObjectIdInOwnedObjectList } from "../src/findObjectIdWithOwnerAddress";
import { splitArtworkShard } from "../src/split_artwork_shard";
import { transferArtworkShard } from "../src/transfer_artwork_shard";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getObject,
  getOwnedObjects,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER2_PHRASE,
} from "./test-helpers";
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
      receiverAddress: USER1_ADDRESS,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    await transferArtworkShard({
      artworkId,
      artworkShardId,
      signerPhrase: USER1_PHRASE,
      receiverAddress: USER2_ADDRESS,
      packageId: PACKAGE_ID,
    });

    const transferredShard = await getObject(artworkShardId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredShard.data.content.fields.shares, "12");
  });

  it("should split a split shard and transfer it to new owner", async () => {
    const { artworkShardId } = await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 12,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });

    const splitShardId1 = await splitArtworkShard({
      artworkShardId,
      signerPhrase: USER2_PHRASE,
      shares: 5,
      packageId: PACKAGE_ID,
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
      signerPhrase: USER2_PHRASE,
      receiverAddress: USER1_ADDRESS,
      packageId: PACKAGE_ID,
    });

    const ownedObjects = await getOwnedObjects(transferArtworkShardResponse.owner);
    const transferredShard = findObjectIdInOwnedObjectList(
      ownedObjects as OwnedObjectList,
      splitShardId1.artworkShardId
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    assert.strictEqual(transferredShard.data.objectId, splitShardId1.artworkShardId);
  });
});
