"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const artwork_1 = require("../src/artwork");
const artwork_shard_1 = require("../src/artwork_shard");
const config_1 = require("../src/config");
const merge_artwork_shard_1 = require("../src/merge_artwork_shard");
const test_helpers_1 = require("./test-helpers");
const testdata_1 = require("./testdata");
describe("mergeArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should merge artwork shards", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        const { artworkShardId: artworkShard2Id } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        const mergeArtworkShards = await (0, merge_artwork_shard_1.mergeArtworkShard)({
            artworkShard1Id: artworkShardId,
            artworkShard2Id,
            signerPhrase: test_helpers_1.USER1_PHRASE,
            packageId: config_1.PACKAGE_ID,
        });
        const burnedShard = await (0, test_helpers_1.getObject)(artworkShard2Id);
        const newShard = await (0, test_helpers_1.getObject)(mergeArtworkShards.artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(newShard.data.content.fields.shares, "20");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(burnedShard.error.code, "deleted");
    }).timeout(10_000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VBcnR3b3JrU2hhcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbWVyZ2VBcnR3b3JrU2hhcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1Qiw0Q0FBNkM7QUFDN0Msd0RBQXdEO0FBQ3hELDBDQUEyQztBQUMzQyxvRUFBK0Q7QUFDL0QsaURBQW9HO0FBQ3BHLHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLElBQUksU0FBaUIsQ0FBQztJQUN0QixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsU0FBUyxHQUFHLE1BQU0sSUFBQSxxQkFBVyxFQUFDLDZCQUFrQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLGVBQWUsRUFBRSw0QkFBYTtZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUsMkJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDakUsU0FBUztZQUNULFlBQVksRUFBRSwyQkFBWTtZQUMxQixlQUFlLEVBQUUsNEJBQWE7WUFDOUIsTUFBTSxFQUFFLEVBQUU7WUFDVixTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLDJCQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQ2pELGVBQWUsRUFBRSxjQUFjO1lBQy9CLGVBQWU7WUFDZixZQUFZLEVBQUUsMkJBQVk7WUFDMUIsU0FBUyxFQUFFLG1CQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5pbXBvcnQgeyBtaW50QXJ0d29yayB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5pbXBvcnQgeyBtZXJnZUFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvbWVyZ2VfYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgQURNSU5fQ0FQX0lELCBBRE1JTl9QSFJBU0UsIGdldE9iamVjdCwgVVNFUjFfQUREUkVTUywgVVNFUjFfUEhSQVNFIH0gZnJvbSBcIi4vdGVzdC1oZWxwZXJzXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya09wdGlvbnMgfSBmcm9tIFwiLi90ZXN0ZGF0YVwiO1xuXG5kZXNjcmliZShcIm1lcmdlQXJ0d29ya1NoYXJkXCIsICgpID0+IHtcbiAgbGV0IGFydHdvcmtJZDogc3RyaW5nO1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhcnR3b3JrSWQgPSBhd2FpdCBtaW50QXJ0d29yayhtaW50QXJ0d29ya09wdGlvbnMpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBtZXJnZSBhcnR3b3JrIHNoYXJkc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgIHNoYXJlczogMTAsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZDogYXJ0d29ya1NoYXJkMklkIH0gPSBhd2FpdCBtaW50QXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtJZCxcbiAgICAgIHNpZ25lclBocmFzZTogQURNSU5fUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMV9BRERSRVNTLFxuICAgICAgc2hhcmVzOiAxMCxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICAgIGFkbWluQ2FwSWQ6IEFETUlOX0NBUF9JRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lcmdlQXJ0d29ya1NoYXJkcyA9IGF3YWl0IG1lcmdlQXJ0d29ya1NoYXJkKHtcbiAgICAgIGFydHdvcmtTaGFyZDFJZDogYXJ0d29ya1NoYXJkSWQsXG4gICAgICBhcnR3b3JrU2hhcmQySWQsXG4gICAgICBzaWduZXJQaHJhc2U6IFVTRVIxX1BIUkFTRSxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICB9KTtcbiAgICBjb25zdCBidXJuZWRTaGFyZCA9IGF3YWl0IGdldE9iamVjdChhcnR3b3JrU2hhcmQySWQpO1xuICAgIGNvbnN0IG5ld1NoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KG1lcmdlQXJ0d29ya1NoYXJkcy5hcnR3b3JrU2hhcmRJZCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwobmV3U2hhcmQuZGF0YS5jb250ZW50LmZpZWxkcy5zaGFyZXMsIFwiMjBcIik7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwoYnVybmVkU2hhcmQuZXJyb3IuY29kZSwgXCJkZWxldGVkXCIpO1xuICB9KS50aW1lb3V0KDEwXzAwMCk7XG59KTtcbiJdfQ==