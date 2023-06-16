import assert from "assert";

import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { ADMIN_PHRASE, USER1_PHRASE, USER2_PHRASE } from "../setup/src/config";
import { mintArtworkOptions } from "./testdata";

describe("mintArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should issue new shares", async () => {
    const artworkShardId = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 2 });
    assert.ok(artworkShardId);
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 501 }));
  });

  it("should not issue new shares, when sold out", async () => {
    await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 150 });
    await mintArtworkShard({ artworkId, phrase: USER2_PHRASE, shares: 250 });
    await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 98 });
    await assert.rejects(mintArtworkShard({ artworkId, phrase: USER2_PHRASE, shares: 3 }));
  });

  it("can give shares to OAM and owner", async () => {
    await mintArtworkShard({ artworkId, phrase: ADMIN_PHRASE, shares: 150 });
    await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 50 });
    await mintArtworkShard({ artworkId, phrase: USER2_PHRASE, shares: 1 });
  });

  it.skip("can set a currency of a contract", async () => {
    assert.ok(false);
  });
  it.skip("can sell some shares to another user", async () => {
    assert.ok(false);
  });
  it.skip("can sell the whole artwork and change the owner of the artwork", async () => {
    assert.ok(false);
  });
  it.skip("can set the outgoing sale price of the artwork", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after artwork is sold", async () => {
    assert.ok(false);
  });
});
