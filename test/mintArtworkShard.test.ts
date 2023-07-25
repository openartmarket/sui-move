import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintArtwork } from "../src/artwork";
import { mintArtworkShard } from "../src/artwork_shard";
import { PACKAGE_ID } from "../src/config";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  USER1_ADDRESS,
  USER2_ADDRESS,
} from "./test-helpers";
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
      receiverAddress: USER1_ADDRESS,
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
        receiverAddress: USER1_ADDRESS,
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
      receiverAddress: USER1_ADDRESS,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 250,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 98,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await assert.rejects(
      mintArtworkShard({
        artworkId,
        signerPhrase: ADMIN_PHRASE,
        receiverAddress: USER2_ADDRESS,
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
      receiverAddress: ADMIN_ADDRESS,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 50,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
    });
    await mintArtworkShard({
      artworkId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
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
