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
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        const { artworkShardId: artworkShard2Id } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: config_1.ADMIN_PHRASE,
            recieverPhrase: config_1.USER1_PHRASE,
            shares: 10,
            packageId: config_1.PACKAGE_ID,
            adminCapId: config_1.ADMIN_CAP_ID,
        });
        const mergeArtworkShards = await (0, merge_artwork_shard_1.mergeArtworkShard)({
            artworkShard1Id: artworkShardId,
            artworkShard2Id,
            signerPhrase: config_1.USER1_PHRASE,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VBcnR3b3JrU2hhcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbWVyZ2VBcnR3b3JrU2hhcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUU1Qiw0Q0FBNkM7QUFDN0Msd0RBQXdEO0FBQ3hELDBDQUFxRjtBQUNyRixvRUFBK0Q7QUFDL0QsaURBQTJDO0FBQzNDLHlDQUFnRDtBQUVoRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLElBQUksU0FBaUIsQ0FBQztJQUN0QixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsU0FBUyxHQUFHLE1BQU0sSUFBQSxxQkFBVyxFQUFDLDZCQUFrQixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLHFCQUFZO1lBQzFCLGNBQWMsRUFBRSxxQkFBWTtZQUM1QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUscUJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLElBQUEsZ0NBQWdCLEVBQUM7WUFDakUsU0FBUztZQUNULFlBQVksRUFBRSxxQkFBWTtZQUMxQixjQUFjLEVBQUUscUJBQVk7WUFDNUIsTUFBTSxFQUFFLEVBQUU7WUFDVixTQUFTLEVBQUUsbUJBQVU7WUFDckIsVUFBVSxFQUFFLHFCQUFZO1NBQ3pCLENBQUMsQ0FBQztRQUVILE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQ2pELGVBQWUsRUFBRSxjQUFjO1lBQy9CLGVBQWU7WUFDZixZQUFZLEVBQUUscUJBQVk7WUFDMUIsU0FBUyxFQUFFLG1CQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BFLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5RCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5pbXBvcnQgeyBtaW50QXJ0d29yayB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgQURNSU5fQ0FQX0lELCBBRE1JTl9QSFJBU0UsIFBBQ0tBR0VfSUQsIFVTRVIxX1BIUkFTRSB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5pbXBvcnQgeyBtZXJnZUFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvbWVyZ2VfYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgZ2V0T2JqZWN0IH0gZnJvbSBcIi4vdGVzdC1oZWxwZXJzXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29ya09wdGlvbnMgfSBmcm9tIFwiLi90ZXN0ZGF0YVwiO1xuXG5kZXNjcmliZShcIm1lcmdlQXJ0d29ya1NoYXJkXCIsICgpID0+IHtcbiAgbGV0IGFydHdvcmtJZDogc3RyaW5nO1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhcnR3b3JrSWQgPSBhd2FpdCBtaW50QXJ0d29yayhtaW50QXJ0d29ya09wdGlvbnMpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBtZXJnZSBhcnR3b3JrIHNoYXJkc1wiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2lldmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDEwLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuICAgIGNvbnN0IHsgYXJ0d29ya1NoYXJkSWQ6IGFydHdvcmtTaGFyZDJJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2lldmVyUGhyYXNlOiBVU0VSMV9QSFJBU0UsXG4gICAgICBzaGFyZXM6IDEwLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgICAgYWRtaW5DYXBJZDogQURNSU5fQ0FQX0lELFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVyZ2VBcnR3b3JrU2hhcmRzID0gYXdhaXQgbWVyZ2VBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya1NoYXJkMUlkOiBhcnR3b3JrU2hhcmRJZCxcbiAgICAgIGFydHdvcmtTaGFyZDJJZCxcbiAgICAgIHNpZ25lclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgIH0pO1xuICAgIGNvbnN0IGJ1cm5lZFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KGFydHdvcmtTaGFyZDJJZCk7XG4gICAgY29uc3QgbmV3U2hhcmQgPSBhd2FpdCBnZXRPYmplY3QobWVyZ2VBcnR3b3JrU2hhcmRzLmFydHdvcmtTaGFyZElkKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChuZXdTaGFyZC5kYXRhLmNvbnRlbnQuZmllbGRzLnNoYXJlcywgXCIyMFwiKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChidXJuZWRTaGFyZC5lcnJvci5jb2RlLCBcImRlbGV0ZWRcIik7XG4gIH0pLnRpbWVvdXQoMTBfMDAwKTtcbn0pO1xuIl19