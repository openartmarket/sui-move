import assert from "assert";

import { mintArtwork, MintArtworkParams } from "../setup/src/artwork";
import { mintArtworkShard, transferArtworkShard } from "../setup/src/artwork_shard";
import { ADMIN_PHRASE, USER1_PHRASE, USER2_PHRASE } from "../setup/src/config";
import { splitArtworkShard } from "../setup/src/split_artwork_shard";

const mintArtworkOptions: MintArtworkParams = {
  totalSupply: 500,
  sharePrice: 10,
  multiplier: 100,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  creationDate: "1685548680595",
  description: "Choconta painting",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
};

describe("Artwork issue a contract", () => {
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
  it.only("can sell shares to another user", async () => {
    const artworkShardId = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 150 });
    const transferShard = await transferArtworkShard({ artworkId, artworkShardId, currentOwner: USER1_PHRASE, newOwner: USER2_PHRASE });
    assert.ok(transferShard);

    
  });
  it.only("can sell shares some shares to another user", async () => {
    const artworkShardId = await mintArtworkShard({ artworkId, phrase: USER1_PHRASE, shares: 150 });
    const splitShardId = await splitArtworkShard(artworkShardId, 110);
    assert.ok(splitShardId);
    const transferShard = await transferArtworkShard({ artworkId, artworkShardId: splitShardId, currentOwner: USER1_PHRASE, newOwner: USER2_PHRASE });
    assert.ok(transferShard);

    
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
