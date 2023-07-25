"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const artwork_1 = require("../src/artwork");
const artwork_shard_1 = require("../src/artwork_shard");
const config_1 = require("../src/config");
const split_artwork_shard_1 = require("../src/split_artwork_shard");
const test_helpers_1 = require("./test-helpers");
const testdata_1 = require("./testdata");
describe("splitArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should split an artwork shard", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        const splitShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId,
            signerPhrase: config_1.USER1_PHRASE,
            shares: 2,
            packageId: config_1.PACKAGE_ID
        });
        // Get the shard and check that it has 2 shares
        const splitShard = await (0, test_helpers_1.getObject)(splitShardId.artworkShardId);
        const oldShard = await (0, test_helpers_1.getObject)(artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(splitShard.data.content.fields.shares, "2");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(oldShard.data.content.fields.shares, "8");
    }).timeout(10_000);
    it("should split a split shard", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 12,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        const splitShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId,
            signerPhrase: config_1.USER1_PHRASE,
            shares: 5,
            packageId: config_1.PACKAGE_ID
        });
        const splitAgainShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId: splitShardId.artworkShardId,
            signerPhrase: config_1.USER1_PHRASE,
            shares: 3,
            packageId: config_1.PACKAGE_ID
        });
        const oldShard = await (0, test_helpers_1.getObject)(artworkShardId);
        const splitShard = await (0, test_helpers_1.getObject)(splitShardId.artworkShardId);
        const splitAgainShard = await (0, test_helpers_1.getObject)(splitAgainShardId.artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(oldShard.data.content.fields.shares, "7");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(splitShard.data.content.fields.shares, "2");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(splitAgainShard.data.content.fields.shares, "3");
    }).timeout(10_000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRBcnR3b3JrU2hhcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qvc3BsaXRBcnR3b3JrU2hhcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1Qiw0Q0FBNkM7QUFDN0Msd0RBQXdEO0FBQ3hELDBDQUFxRjtBQUNyRixvRUFBK0Q7QUFDL0QsaURBQTJDO0FBQzNDLHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLElBQUksU0FBaUIsQ0FBQztJQUN0QixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsU0FBUyxHQUFHLE1BQU0sSUFBQSxxQkFBVyxFQUFDLDZCQUFrQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0MsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLHFCQUFZO1lBQzFCLGNBQWMsRUFBRSxxQkFBWTtZQUM1QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUscUJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQzNDLGNBQWM7WUFDZCxZQUFZLEVBQUUscUJBQVk7WUFDMUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsK0NBQStDO1FBQy9DLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsd0JBQVMsRUFBQyxjQUFjLENBQUMsQ0FBQztRQUVqRCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0QsNkRBQTZEO1FBQzdELGFBQWE7UUFDYixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuQixFQUFFLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLHFCQUFZO1lBQzFCLGNBQWMsRUFBRSxxQkFBWTtZQUM1QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUscUJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQzNDLGNBQWM7WUFDZCxZQUFZLEVBQUUscUJBQVk7WUFDMUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUEsdUNBQWlCLEVBQUM7WUFDaEQsY0FBYyxFQUFFLFlBQVksQ0FBQyxjQUFjO1lBQzNDLFlBQVksRUFBRSxxQkFBWTtZQUMxQixNQUFNLEVBQUUsQ0FBQztZQUNULFNBQVMsRUFBRSxtQkFBVTtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsd0JBQVMsRUFBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsd0JBQVMsRUFBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsTUFBTSxlQUFlLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUUsNkRBQTZEO1FBQzdELGFBQWE7UUFDYixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdELDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvRCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5cbmltcG9ydCB7IG1pbnRBcnR3b3JrIH0gZnJvbSBcIi4uL3NyYy9hcnR3b3JrXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya1NoYXJkIH0gZnJvbSBcIi4uL3NyYy9hcnR3b3JrX3NoYXJkXCI7XG5pbXBvcnQgeyBBRE1JTl9DQVBfSUQsIEFETUlOX1BIUkFTRSwgUEFDS0FHRV9JRCwgVVNFUjFfUEhSQVNFIH0gZnJvbSBcIi4uL3NyYy9jb25maWdcIjtcbmltcG9ydCB7IHNwbGl0QXJ0d29ya1NoYXJkIH0gZnJvbSBcIi4uL3NyYy9zcGxpdF9hcnR3b3JrX3NoYXJkXCI7XG5pbXBvcnQgeyBnZXRPYmplY3QgfSBmcm9tIFwiLi90ZXN0LWhlbHBlcnNcIjtcbmltcG9ydCB7IG1pbnRBcnR3b3JrT3B0aW9ucyB9IGZyb20gXCIuL3Rlc3RkYXRhXCI7XG5cbmRlc2NyaWJlKFwic3BsaXRBcnR3b3JrU2hhcmRcIiwgKCkgPT4ge1xuICBsZXQgYXJ0d29ya0lkOiBzdHJpbmc7XG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGFydHdvcmtJZCA9IGF3YWl0IG1pbnRBcnR3b3JrKG1pbnRBcnR3b3JrT3B0aW9ucyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHNwbGl0IGFuIGFydHdvcmsgc2hhcmRcIiwgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgYXJ0d29ya1NoYXJkSWQgfSA9IGF3YWl0IG1pbnRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBBRE1JTl9QSFJBU0UsXG4gICAgICByZWNpZXZlclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiAxMCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNwbGl0U2hhcmRJZCA9IGF3YWl0IHNwbGl0QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtTaGFyZElkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSURcbiAgICB9KTtcblxuICAgIC8vIEdldCB0aGUgc2hhcmQgYW5kIGNoZWNrIHRoYXQgaXQgaGFzIDIgc2hhcmVzXG4gICAgY29uc3Qgc3BsaXRTaGFyZCA9IGF3YWl0IGdldE9iamVjdChzcGxpdFNoYXJkSWQuYXJ0d29ya1NoYXJkSWQpO1xuICAgIGNvbnN0IG9sZFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KGFydHdvcmtTaGFyZElkKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHNwbGl0U2hhcmQuZGF0YS5jb250ZW50LmZpZWxkcy5zaGFyZXMsIFwiMlwiKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKG9sZFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjhcIik7XG4gIH0pLnRpbWVvdXQoMTBfMDAwKTtcblxuICBpdChcInNob3VsZCBzcGxpdCBhIHNwbGl0IHNoYXJkXCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGFydHdvcmtTaGFyZElkIH0gPSBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjaWV2ZXJQaHJhc2U6IFVTRVIxX1BIUkFTRSxcbiAgICAgIHNoYXJlczogMTIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcGxpdFNoYXJkSWQgPSBhd2FpdCBzcGxpdEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrU2hhcmRJZCxcbiAgICAgIHNpZ25lclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiA1LFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lEXG4gICAgfSk7XG4gICAgY29uc3Qgc3BsaXRBZ2FpblNoYXJkSWQgPSBhd2FpdCBzcGxpdEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrU2hhcmRJZDogc3BsaXRTaGFyZElkLmFydHdvcmtTaGFyZElkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDMsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSURcbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KGFydHdvcmtTaGFyZElkKTtcbiAgICBjb25zdCBzcGxpdFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KHNwbGl0U2hhcmRJZC5hcnR3b3JrU2hhcmRJZCk7XG4gICAgY29uc3Qgc3BsaXRBZ2FpblNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KHNwbGl0QWdhaW5TaGFyZElkLmFydHdvcmtTaGFyZElkKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKG9sZFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjdcIik7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChzcGxpdFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjJcIik7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChzcGxpdEFnYWluU2hhcmQuZGF0YS5jb250ZW50LmZpZWxkcy5zaGFyZXMsIFwiM1wiKTtcbiAgfSkudGltZW91dCgxMF8wMDApO1xufSk7XG4iXX0=