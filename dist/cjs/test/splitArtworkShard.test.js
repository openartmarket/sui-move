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
const test_helpers_2 = require("./test-helpers");
const testdata_1 = require("./testdata");
describe("splitArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should split an artwork shard", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        const splitShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId,
            signerPhrase: test_helpers_1.USER1_PHRASE,
            shares: 2,
            packageId: config_1.PACKAGE_ID,
        });
        // Get the shard and check that it has 2 shares
        const splitShard = await (0, test_helpers_2.getObject)(splitShardId.artworkShardId);
        const oldShard = await (0, test_helpers_2.getObject)(artworkShardId);
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
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 12,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        const splitShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId,
            signerPhrase: test_helpers_1.USER1_PHRASE,
            shares: 5,
            packageId: config_1.PACKAGE_ID,
        });
        const splitAgainShardId = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId: splitShardId.artworkShardId,
            signerPhrase: test_helpers_1.USER1_PHRASE,
            shares: 3,
            packageId: config_1.PACKAGE_ID,
        });
        const oldShard = await (0, test_helpers_2.getObject)(artworkShardId);
        const splitShard = await (0, test_helpers_2.getObject)(splitShardId.artworkShardId);
        const splitAgainShard = await (0, test_helpers_2.getObject)(splitAgainShardId.artworkShardId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRBcnR3b3JrU2hhcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qvc3BsaXRBcnR3b3JrU2hhcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1Qiw0Q0FBNkM7QUFDN0Msd0RBQXdEO0FBQ3hELDBDQUEyQztBQUMzQyxvRUFBK0Q7QUFDL0QsaURBQXlGO0FBQ3pGLGlEQUEyQztBQUMzQyx5Q0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLFNBQWlCLENBQUM7SUFDdEIsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLFNBQVMsR0FBRyxNQUFNLElBQUEscUJBQVcsRUFBQyw2QkFBa0IsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdDLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDaEQsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLEVBQUU7WUFDVixTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSx1Q0FBaUIsRUFBQztZQUMzQyxjQUFjO1lBQ2QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFLG1CQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUVILCtDQUErQztRQUMvQyxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUEsd0JBQVMsRUFBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsY0FBYyxDQUFDLENBQUM7UUFFakQsNkRBQTZEO1FBQzdELGFBQWE7UUFDYixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRS9ELDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFbkIsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDaEQsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLEVBQUU7WUFDVixTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSx1Q0FBaUIsRUFBQztZQUMzQyxjQUFjO1lBQ2QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFLG1CQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUNILE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQ2hELGNBQWMsRUFBRSxZQUFZLENBQUMsY0FBYztZQUMzQyxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTFFLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3RCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0QsNkRBQTZEO1FBQzdELGFBQWE7UUFDYixnQkFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5pbXBvcnQgeyBtaW50QXJ0d29yayB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5pbXBvcnQgeyBzcGxpdEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvc3BsaXRfYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgQURNSU5fQ0FQX0lELCBBRE1JTl9QSFJBU0UsIFVTRVIxX0FERFJFU1MsIFVTRVIxX1BIUkFTRSB9IGZyb20gXCIuL3Rlc3QtaGVscGVyc1wiO1xuaW1wb3J0IHsgZ2V0T2JqZWN0IH0gZnJvbSBcIi4vdGVzdC1oZWxwZXJzXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya09wdGlvbnMgfSBmcm9tIFwiLi90ZXN0ZGF0YVwiO1xuXG5kZXNjcmliZShcInNwbGl0QXJ0d29ya1NoYXJkXCIsICgpID0+IHtcbiAgbGV0IGFydHdvcmtJZDogc3RyaW5nO1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhcnR3b3JrSWQgPSBhd2FpdCBtaW50QXJ0d29yayhtaW50QXJ0d29ya09wdGlvbnMpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBzcGxpdCBhbiBhcnR3b3JrIHNoYXJkXCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGFydHdvcmtTaGFyZElkIH0gPSBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMV9BRERSRVNTLFxuICAgICAgc2hhcmVzOiAxMCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNwbGl0U2hhcmRJZCA9IGF3YWl0IHNwbGl0QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtTaGFyZElkLFxuICAgICAgc2lnbmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgfSk7XG5cbiAgICAvLyBHZXQgdGhlIHNoYXJkIGFuZCBjaGVjayB0aGF0IGl0IGhhcyAyIHNoYXJlc1xuICAgIGNvbnN0IHNwbGl0U2hhcmQgPSBhd2FpdCBnZXRPYmplY3Qoc3BsaXRTaGFyZElkLmFydHdvcmtTaGFyZElkKTtcbiAgICBjb25zdCBvbGRTaGFyZCA9IGF3YWl0IGdldE9iamVjdChhcnR3b3JrU2hhcmRJZCk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChzcGxpdFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjJcIik7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChvbGRTaGFyZC5kYXRhLmNvbnRlbnQuZmllbGRzLnNoYXJlcywgXCI4XCIpO1xuICB9KS50aW1lb3V0KDEwXzAwMCk7XG5cbiAgaXQoXCJzaG91bGQgc3BsaXQgYSBzcGxpdCBzaGFyZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgIHNoYXJlczogMTIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcGxpdFNoYXJkSWQgPSBhd2FpdCBzcGxpdEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrU2hhcmRJZCxcbiAgICAgIHNpZ25lclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiA1LFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgIH0pO1xuICAgIGNvbnN0IHNwbGl0QWdhaW5TaGFyZElkID0gYXdhaXQgc3BsaXRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya1NoYXJkSWQ6IHNwbGl0U2hhcmRJZC5hcnR3b3JrU2hhcmRJZCxcbiAgICAgIHNpZ25lclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgc2hhcmVzOiAzLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb2xkU2hhcmQgPSBhd2FpdCBnZXRPYmplY3QoYXJ0d29ya1NoYXJkSWQpO1xuICAgIGNvbnN0IHNwbGl0U2hhcmQgPSBhd2FpdCBnZXRPYmplY3Qoc3BsaXRTaGFyZElkLmFydHdvcmtTaGFyZElkKTtcbiAgICBjb25zdCBzcGxpdEFnYWluU2hhcmQgPSBhd2FpdCBnZXRPYmplY3Qoc3BsaXRBZ2FpblNoYXJkSWQuYXJ0d29ya1NoYXJkSWQpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwob2xkU2hhcmQuZGF0YS5jb250ZW50LmZpZWxkcy5zaGFyZXMsIFwiN1wiKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHNwbGl0U2hhcmQuZGF0YS5jb250ZW50LmZpZWxkcy5zaGFyZXMsIFwiMlwiKTtcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHNwbGl0QWdhaW5TaGFyZC5kYXRhLmNvbnRlbnQuZmllbGRzLnNoYXJlcywgXCIzXCIpO1xuICB9KS50aW1lb3V0KDEwXzAwMCk7XG59KTtcbiJdfQ==