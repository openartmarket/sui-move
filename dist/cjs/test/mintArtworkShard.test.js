"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const artwork_1 = require("../src/artwork");
const artwork_shard_1 = require("../src/artwork_shard");
const config_1 = require("../src/config");
const test_helpers_1 = require("./test-helpers");
const testdata_1 = require("./testdata");
describe("mintArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should issue new shares", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 2,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
    });
    it("should not issue new shares, when asking for too much", async () => {
        await assert_1.default.rejects((0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 501,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        }));
    });
    it("should not issue new shares, when sold out", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 150,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER2_ADDRESS,
            shares: 250,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 98,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await assert_1.default.rejects((0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER2_ADDRESS,
            shares: 3,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        }));
    });
    it("can give shares to OAM and owner", async () => {
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.ADMIN_ADDRESS,
            shares: 150,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 50,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER2_ADDRESS,
            shares: 1,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
    });
    it.skip("can set the outgoing sale price of the artwork", async () => {
        assert_1.default.ok(false);
    });
    it.skip("can burn the shares after artwork is sold", async () => {
        assert_1.default.ok(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWludEFydHdvcmtTaGFyZC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9taW50QXJ0d29ya1NoYXJkLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFFNUIsNENBQTZDO0FBQzdDLHdEQUF3RDtBQUN4RCwwQ0FBMkM7QUFDM0MsaURBTXdCO0FBQ3hCLHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUksU0FBaUIsQ0FBQztJQUN0QixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsU0FBUyxHQUFHLE1BQU0sSUFBQSxxQkFBVyxFQUFDLDZCQUFrQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkMsTUFBTSxJQUFBLGdDQUFnQixFQUFDO1lBQ3JCLFNBQVM7WUFDVCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFLG1CQUFVO1lBQ3JCLFVBQVUsRUFBRSwyQkFBWTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyRSxNQUFNLGdCQUFNLENBQUMsT0FBTyxDQUNsQixJQUFBLGdDQUFnQixFQUFDO1lBQ2YsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLEdBQUc7WUFDWCxTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUQsTUFBTSxJQUFBLGdDQUFnQixFQUFDO1lBQ3JCLFNBQVM7WUFDVCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsU0FBUyxFQUFFLG1CQUFVO1lBQ3JCLFVBQVUsRUFBRSwyQkFBWTtTQUN6QixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDckIsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLEdBQUc7WUFDWCxTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNyQixTQUFTO1lBQ1QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLGVBQWUsRUFBRSw0QkFBYTtZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUsMkJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxnQkFBTSxDQUFDLE9BQU8sQ0FDbEIsSUFBQSxnQ0FBZ0IsRUFBQztZQUNmLFNBQVM7WUFDVCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFLG1CQUFVO1lBQ3JCLFVBQVUsRUFBRSwyQkFBWTtTQUN6QixDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2hELE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNyQixTQUFTO1lBQ1QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLGVBQWUsRUFBRSw0QkFBYTtZQUM5QixNQUFNLEVBQUUsR0FBRztZQUNYLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUsMkJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxJQUFBLGdDQUFnQixFQUFDO1lBQ3JCLFNBQVM7WUFDVCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsU0FBUyxFQUFFLG1CQUFVO1lBQ3JCLFVBQVUsRUFBRSwyQkFBWTtTQUN6QixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDckIsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNuRSxnQkFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsMkNBQTJDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUQsZ0JBQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5pbXBvcnQgeyBtaW50QXJ0d29yayB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5pbXBvcnQge1xuICBBRE1JTl9BRERSRVNTLFxuICBBRE1JTl9DQVBfSUQsXG4gIEFETUlOX1BIUkFTRSxcbiAgVVNFUjFfQUREUkVTUyxcbiAgVVNFUjJfQUREUkVTUyxcbn0gZnJvbSBcIi4vdGVzdC1oZWxwZXJzXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya09wdGlvbnMgfSBmcm9tIFwiLi90ZXN0ZGF0YVwiO1xuXG5kZXNjcmliZShcIm1pbnRBcnR3b3JrU2hhcmRcIiwgKCkgPT4ge1xuICBsZXQgYXJ0d29ya0lkOiBzdHJpbmc7XG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGFydHdvcmtJZCA9IGF3YWl0IG1pbnRBcnR3b3JrKG1pbnRBcnR3b3JrT3B0aW9ucyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIGlzc3VlIG5ldyBzaGFyZXNcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNlaXZlckFkZHJlc3M6IFVTRVIxX0FERFJFU1MsXG4gICAgICBzaGFyZXM6IDIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIG5vdCBpc3N1ZSBuZXcgc2hhcmVzLCB3aGVuIGFza2luZyBmb3IgdG9vIG11Y2hcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGFzc2VydC5yZWplY3RzKFxuICAgICAgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICAgIGFydHdvcmtJZCxcbiAgICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgICAgc2hhcmVzOiA1MDEsXG4gICAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgICAgfSlcbiAgICApO1xuICB9KTtcblxuICBpdChcInNob3VsZCBub3QgaXNzdWUgbmV3IHNoYXJlcywgd2hlbiBzb2xkIG91dFwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgIHNoYXJlczogMTUwLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuICAgIGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNlaXZlckFkZHJlc3M6IFVTRVIyX0FERFJFU1MsXG4gICAgICBzaGFyZXM6IDI1MCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMV9BRERSRVNTLFxuICAgICAgc2hhcmVzOiA5OCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBhc3NlcnQucmVqZWN0cyhcbiAgICAgIG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgICBhcnR3b3JrSWQsXG4gICAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgICByZWNlaXZlckFkZHJlc3M6IFVTRVIyX0FERFJFU1MsXG4gICAgICAgIHNoYXJlczogMyxcbiAgICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgICB9KVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KFwiY2FuIGdpdmUgc2hhcmVzIHRvIE9BTSBhbmQgb3duZXJcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNlaXZlckFkZHJlc3M6IEFETUlOX0FERFJFU1MsXG4gICAgICBzaGFyZXM6IDE1MCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMV9BRERSRVNTLFxuICAgICAgc2hhcmVzOiA1MCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcbiAgICBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMl9BRERSRVNTLFxuICAgICAgc2hhcmVzOiAxLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuICB9KTtcblxuICBpdC5za2lwKFwiY2FuIHNldCB0aGUgb3V0Z29pbmcgc2FsZSBwcmljZSBvZiB0aGUgYXJ0d29ya1wiLCBhc3luYyAoKSA9PiB7XG4gICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgfSk7XG4gIGl0LnNraXAoXCJjYW4gYnVybiB0aGUgc2hhcmVzIGFmdGVyIGFydHdvcmsgaXMgc29sZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgYXNzZXJ0Lm9rKGZhbHNlKTtcbiAgfSk7XG59KTtcbiJdfQ==