import assert from "assert";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID, USER1_PHRASE, USER2_PHRASE } from "../src/config";
import { mintArtworkOptions } from "./testdata";

describe("mintArtworkShard", () => {
  let artworkId: string;
  beforeEach(async () => {
    artworkId = await mintArtwork(mintArtworkOptions);
  });

  it("should issue new shares", async () => {
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 2,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintArtworkShard({
        artworkId,
        signerPhrase: ADMIN_PHRASE,
        recieverPhrase: USER1_PHRASE,
        shares: 501,
        packageId: PACKAGE_ID,
        adminCapId: ADMIN_CAP_ID,
      })
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER2_PHRASE,
      shares: 250,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 98,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await assert.rejects(
      mintArtworkShard({
        artworkId,
        signerPhrase: ADMIN_PHRASE,
        recieverPhrase: USER2_PHRASE,
        shares: 3,
        packageId: PACKAGE_ID,
        adminCapId: ADMIN_CAP_ID,
      })
    );
  });

  it("can give shares to OAM and owner", async () => {
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: ADMIN_PHRASE,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER1_PHRASE,
      shares: 50,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      recieverPhrase: USER2_PHRASE,
      shares: 1,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
  });

  it.skip("can set the outgoing sale price of the artwork", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after artwork is sold", async () => {
    assert.ok(false);
  });
});
