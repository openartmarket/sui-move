import assert from "assert";
import { mintArtwork } from "../setup/src/artwork";
import { mintArtworkShard } from "../setup/src/artwork_shard";
import { adminPhrase, user1, user2, user3 } from "../setup/src/config";

const artworkOptions = {
  totalSupply: 500,
  ingoingPrice: 10,
  outgoingPrice: 100,
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
    const txn = await mintArtwork(artworkOptions);
    if (!txn) throw new Error("Could not mint artwork");
    artworkId = txn;
  });
  it("should issue a new contract", async () => {
    assert.ok(artworkId);
  });
  it("should issue new shares", async () => {
    const sale = await mintArtworkShard(artworkId, user1, 2);
    assert.ok(sale);
  });
  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(mintArtworkShard(artworkId, user1, 501));
  });
  it("should not issue new shares, when sold out", async () => {
    const sale1 = await mintArtworkShard(artworkId, user1, 250);
    assert.ok(sale1);
    const sale2 = await mintArtworkShard(artworkId, user2, 250);
    assert.ok(sale2);
    await assert.rejects(mintArtworkShard(artworkId, user3, 1));
  });
  it("should not issue new shares, when sold out", async () => {
    const sale1 = await mintArtworkShard(artworkId, user1, 150);
    assert.ok(sale1);
    const sale2 = await mintArtworkShard(artworkId, user2, 250);
    assert.ok(sale2);
    const sale3 = await mintArtworkShard(artworkId, user3, 100);
    assert.ok(sale3);
    await assert.rejects(mintArtworkShard(artworkId, user2, 1));
  });
  it("can give shares to OAM and owner", async () => {
    const oamShare = await mintArtworkShard(artworkId, adminPhrase, 25);
    assert.ok(oamShare);
    const ownerShare = await mintArtworkShard(artworkId, user1, 50);
    assert.ok(ownerShare);
    const sale1 = await mintArtworkShard(artworkId, user2, 1);
    assert.ok(sale1);
  });
  it.skip("can set a currency of a contract", async () => {});
  it.skip("can sell some shares to another user", async () => {});
  it.skip("can sell the whole artwork and change the owner of the artwork", async () => {});
  it.skip("can set the outgoing sale price of the artwork", async () => {});
  it.skip("can burn the shares after artwork is sold", async () => {});
});
