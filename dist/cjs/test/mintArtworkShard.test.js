"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const artwork_1 = require("../src/artwork");
const artwork_shard_1 = require("../src/artwork_shard");
const config_1 = require("../src/config");
const testdata_1 = require("./testdata");
describe("mintArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should issue new shares", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 2,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
    });
    it("should not issue new shares, when asking for too much", async () => {
        await assert_1.default.rejects((0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 501,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        }));
    });
    it("should not issue new shares, when sold out", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 150,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER2_PHRASE,
            shares: 250,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 98,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        await assert_1.default.rejects((0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER2_PHRASE,
            shares: 3,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        }));
    });
    it("can give shares to OAM and owner", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.ADMIN_PHRASE,
            shares: 150,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 50,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER2_PHRASE,
            shares: 1,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
    });
    it.skip("can set a currency of a contract", async () => {
        assert_1.default.ok(false);
    });
    it.skip("can sell some shares to another user", async () => {
        assert_1.default.ok(false);
    });
    it.skip("can sell the whole artwork and change the owner of the artwork", async () => {
        assert_1.default.ok(false);
    });
    it.skip("can set the outgoing sale price of the artwork", async () => {
        assert_1.default.ok(false);
    });
    it.skip("can burn the shares after artwork is sold", async () => {
        assert_1.default.ok(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWludEFydHdvcmtTaGFyZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9taW50QXJ0d29ya1NoYXJkLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFFNUIsNENBQTZDO0FBQzdDLHdEQUF3RDtBQUN4RCwwQ0FBbUc7QUFDbkcseUNBQWdEO0FBRWhELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixTQUFTLEdBQUcsTUFBTSxJQUFBLHFCQUFXLEVBQUMsNkJBQWtCLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2QyxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDckIsU0FBUztZQUNULFlBQVksRUFBRSxxQkFBWTtZQUMxQixjQUFjLEVBQUUscUJBQVk7WUFDNUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLHFCQUFZO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3JFLE1BQU0sZ0JBQU0sQ0FBQyxPQUFPLENBQ2xCLElBQUEsZ0NBQWdCLEVBQUM7WUFDZixTQUFTO1lBQ1QsWUFBWSxFQUFFLHFCQUFZO1lBQzFCLGNBQWMsRUFBRSxxQkFBWTtZQUM1QixNQUFNLEVBQUUsR0FBRztZQUNYLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUscUJBQVk7U0FDekIsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxRCxNQUFN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QztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5cbmltcG9ydCB7IG1pbnRBcnR3b3JrIH0gZnJvbSBcIi4uL3NyYy9hcnR3b3JrXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya1NoYXJkIH0gZnJvbSBcIi4uL3NyYy9hcnR3b3JrX3NoYXJkXCI7XG5pbXBvcnQgeyBBRE1JTl9DQVBfSUQsIEFETUlOX1BIUkFTRSwgUEFDS0FHRV9JRCwgVVNFUjFfUEhSQVNFLCBVU0VSMl9QSFJBU0UgfSBmcm9tIFwiLi4vc3JjL2NvbmZpZ1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtPcHRpb25zIH0gZnJvbSBcIi4vdGVzdGRhdGFcIjtcblxuZGVzY3JpYmUoXCJtaW50QXJ0d29ya1NoYXJkXCIsICgpID0+IHtcbiAgbGV0IGFydHdvcmtJZDogc3RyaW5nO1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhcnR3b3JrSWQgPSBhd2FpdCBtaW50QXJ0d29yayhtaW50QXJ0d29ya09wdGlvbnMpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBpc3N1ZSBuZXcgc2hhcmVzXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjaWV2ZXJQaHJhc2U6IFVTRVIxX1BIUkFTRSxcbiAgICAgIHNoYXJlczogMixcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgbm90IGlzc3VlIG5ldyBzaGFyZXMsIHdoZW4gYXNraW5nIGZvciB0b28gbXVjaFwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYXNzZXJ0LnJlamVjdHMoXG4gICAgICBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgICAgYXJ0d29ya0lkLFxuICAgICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgICAgcmVjaWV2ZXJQaHJhc2U6IFVTRVIxX1BIUkFTRSxcbiAgICAgICAgc2hhcmVzOiA1MDEsXG4gICAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgICAgfSlcbiAgICApO1xuICB9KTtcblxuICBpdChcInNob3VsZCBub3QgaXNzdWUgbmV3IHNoYXJlcywgd2hlbiBzb2xkIG91dFwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2lldmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDE1MCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjaWV2ZXJQaHJhc2U6IFVTRVIyX1BIUkFTRSxcbiAgICAgIHNoYXJlczogMjUwLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuICAgIGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNpZXZlclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiA5OCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBhc3NlcnQucmVqZWN0cyhcbiAgICAgIG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgICBhcnR3b3JrSWQsXG4gICAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgICByZWNpZXZlclBocmFzZTogVVNFUjJfUEhSQVNFLFxuICAgICAgICBzaGFyZXM6IDMsXG4gICAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgICAgfSlcbiAgICApO1xuICB9KTtcblxuICBpdChcImNhbiBnaXZlIHNoYXJlcyB0byBPQU0gYW5kIG93bmVyXCIsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjaWV2ZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHNoYXJlczogMTUwLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuICAgIGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNpZXZlclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiA1MCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjaWV2ZXJQaHJhc2U6IFVTRVIyX1BIUkFTRSxcbiAgICAgIHNoYXJlczogMSxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQuc2tpcChcImNhbiBzZXQgYSBjdXJyZW5jeSBvZiBhIGNvbnRyYWN0XCIsIGFzeW5jICgpID0+IHtcbiAgICBhc3NlcnQub2soZmFsc2UpO1xuICB9KTtcbiAgaXQuc2tpcChcImNhbiBzZWxsIHNvbWUgc2hhcmVzIHRvIGFub3RoZXIgdXNlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgfSk7XG4gIGl0LnNraXAoXCJjYW4gc2VsbCB0aGUgd2hvbGUgYXJ0d29yayBhbmQgY2hhbmdlIHRoZSBvd25lciBvZiB0aGUgYXJ0d29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgfSk7XG4gIGl0LnNraXAoXCJjYW4gc2V0IHRoZSBvdXRnb2luZyBzYWxlIHByaWNlIG9mIHRoZSBhcnR3b3JrXCIsIGFzeW5jICgpID0+IHtcbiAgICBhc3NlcnQub2soZmFsc2UpO1xuICB9KTtcbiAgaXQuc2tpcChcImNhbiBidXJuIHRoZSBzaGFyZXMgYWZ0ZXIgYXJ0d29yayBpcyBzb2xkXCIsIGFzeW5jICgpID0+IHtcbiAgICBhc3NlcnQub2soZmFsc2UpO1xuICB9KTtcbn0pO1xuIl19