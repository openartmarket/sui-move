"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const artwork_1 = require("../src/artwork");
const artwork_shard_1 = require("../src/artwork_shard");
const config_1 = require("../src/config");
const findObjectIdWithOwnerAddress_1 = require("../src/findObjectIdWithOwnerAddress");
const split_artwork_shard_1 = require("../src/split_artwork_shard");
const transfer_artwork_shard_1 = require("../src/transfer_artwork_shard");
const test_helpers_1 = require("./test-helpers");
const testdata_1 = require("./testdata");
describe("transferArtworkShard", () => {
    let artworkId;
    beforeEach(async () => {
        artworkId = await (0, artwork_1.mintArtwork)(testdata_1.mintArtworkOptions);
    });
    it("should mint a shard and then transfer it", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            shares: 12,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        await (0, transfer_artwork_shard_1.transferArtworkShard)({
            artworkId,
            artworkShardId,
            signerPhrase: test_helpers_1.USER1_PHRASE,
            receiverAddress: test_helpers_1.USER2_ADDRESS,
            packageId: config_1.PACKAGE_ID,
        });
        const transferredShard = await (0, test_helpers_1.getObject)(artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(transferredShard.data.content.fields.shares, "12");
    }).timeout(10_000);
    it("should split a split shard and transfer it to new owner", async () => {
        const { artworkShardId } = await (0, artwork_shard_1.mintArtworkShard)({
            artworkId,
            signerPhrase: test_helpers_1.ADMIN_PHRASE,
            receiverAddress: test_helpers_1.USER2_ADDRESS,
            shares: 12,
            packageId: config_1.PACKAGE_ID,
            adminCapId: test_helpers_1.ADMIN_CAP_ID,
        });
        const splitShardId1 = await (0, split_artwork_shard_1.splitArtworkShard)({
            artworkShardId,
            signerPhrase: test_helpers_1.USER2_PHRASE,
            shares: 5,
            packageId: config_1.PACKAGE_ID,
        });
        const oldShard = await (0, test_helpers_1.getObject)(artworkShardId);
        const splitShard = await (0, test_helpers_1.getObject)(splitShardId1.artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(oldShard.data.content.fields.shares, "7");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(splitShard.data.content.fields.shares, "5");
        const transferArtworkShardResponse = await (0, transfer_artwork_shard_1.transferArtworkShard)({
            artworkId,
            artworkShardId: splitShardId1.artworkShardId,
            signerPhrase: test_helpers_1.USER2_PHRASE,
            receiverAddress: test_helpers_1.USER1_ADDRESS,
            packageId: config_1.PACKAGE_ID,
        });
        const ownedObjects = await (0, test_helpers_1.getOwnedObjects)(transferArtworkShardResponse.owner);
        const transferredShard = (0, findObjectIdWithOwnerAddress_1.findObjectIdInOwnedObjectList)(ownedObjects, splitShardId1.artworkShardId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert_1.default.strictEqual(transferredShard.data.objectId, splitShardId1.artworkShardId);
    }).timeout(10_000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJBcnR3b3JrU2hhcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvdHJhbnNmZXJBcnR3b3JrU2hhcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUc1Qiw0Q0FBNkM7QUFDN0Msd0RBQXdEO0FBQ3hELDBDQUEyQztBQUMzQyxzRkFBb0Y7QUFDcEYsb0VBQStEO0FBQy9ELDBFQUFxRTtBQUNyRSxpREFTd0I7QUFDeEIseUNBQWdEO0FBRWhELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwQixTQUFTLEdBQUcsTUFBTSxJQUFBLHFCQUFXLEVBQUMsNkJBQWtCLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN4RCxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsTUFBTSxJQUFBLGdDQUFnQixFQUFDO1lBQ2hELFNBQVM7WUFDVCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsU0FBUyxFQUFFLG1CQUFVO1lBQ3JCLFVBQVUsRUFBRSwyQkFBWTtTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUEsNkNBQW9CLEVBQUM7WUFDekIsU0FBUztZQUNULGNBQWM7WUFDZCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLFNBQVMsRUFBRSxtQkFBVTtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBQSx3QkFBUyxFQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pELDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuQixFQUFFLENBQUMseURBQXlELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkUsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE1BQU0sSUFBQSxnQ0FBZ0IsRUFBQztZQUNoRCxTQUFTO1lBQ1QsWUFBWSxFQUFFLDJCQUFZO1lBQzFCLGVBQWUsRUFBRSw0QkFBYTtZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLFNBQVMsRUFBRSxtQkFBVTtZQUNyQixVQUFVLEVBQUUsMkJBQVk7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLHVDQUFpQixFQUFDO1lBQzVDLGNBQWM7WUFDZCxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsTUFBTSxFQUFFLENBQUM7WUFDVCxTQUFTLEVBQUUsbUJBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLHdCQUFTLEVBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLDZEQUE2RDtRQUM3RCxhQUFhO1FBQ2IsZ0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU3RCw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0QsTUFBTSw0QkFBNEIsR0FBRyxNQUFNLElBQUEsNkNBQW9CLEVBQUM7WUFDOUQsU0FBUztZQUNULGNBQWMsRUFBRSxhQUFhLENBQUMsY0FBYztZQUM1QyxZQUFZLEVBQUUsMkJBQVk7WUFDMUIsZUFBZSxFQUFFLDRCQUFhO1lBQzlCLFNBQVMsRUFBRSxtQkFBVTtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUEsOEJBQWUsRUFBQyw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRSxNQUFNLGdCQUFnQixHQUFHLElBQUEsNERBQTZCLEVBQ3BELFlBQStCLEVBQy9CLGFBQWEsQ0FBQyxjQUFjLENBQzdCLENBQUM7UUFDRiw2REFBNkQ7UUFDN0QsYUFBYTtRQUNiLGdCQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25GLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG5pbXBvcnQgeyBPd25lZE9iamVjdExpc3QgfSBmcm9tIFwiLi4vc3JjXCI7XG5pbXBvcnQgeyBtaW50QXJ0d29yayB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya1wiO1xuaW1wb3J0IHsgbWludEFydHdvcmtTaGFyZCB9IGZyb20gXCIuLi9zcmMvYXJ0d29ya19zaGFyZFwiO1xuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5pbXBvcnQgeyBmaW5kT2JqZWN0SWRJbk93bmVkT2JqZWN0TGlzdCB9IGZyb20gXCIuLi9zcmMvZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzc1wiO1xuaW1wb3J0IHsgc3BsaXRBcnR3b3JrU2hhcmQgfSBmcm9tIFwiLi4vc3JjL3NwbGl0X2FydHdvcmtfc2hhcmRcIjtcbmltcG9ydCB7IHRyYW5zZmVyQXJ0d29ya1NoYXJkIH0gZnJvbSBcIi4uL3NyYy90cmFuc2Zlcl9hcnR3b3JrX3NoYXJkXCI7XG5pbXBvcnQge1xuICBBRE1JTl9DQVBfSUQsXG4gIEFETUlOX1BIUkFTRSxcbiAgZ2V0T2JqZWN0LFxuICBnZXRPd25lZE9iamVjdHMsXG4gIFVTRVIxX0FERFJFU1MsXG4gIFVTRVIxX1BIUkFTRSxcbiAgVVNFUjJfQUREUkVTUyxcbiAgVVNFUjJfUEhSQVNFLFxufSBmcm9tIFwiLi90ZXN0LWhlbHBlcnNcIjtcbmltcG9ydCB7IG1pbnRBcnR3b3JrT3B0aW9ucyB9IGZyb20gXCIuL3Rlc3RkYXRhXCI7XG5cbmRlc2NyaWJlKFwidHJhbnNmZXJBcnR3b3JrU2hhcmRcIiwgKCkgPT4ge1xuICBsZXQgYXJ0d29ya0lkOiBzdHJpbmc7XG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGFydHdvcmtJZCA9IGF3YWl0IG1pbnRBcnR3b3JrKG1pbnRBcnR3b3JrT3B0aW9ucyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIG1pbnQgYSBzaGFyZCBhbmQgdGhlbiB0cmFuc2ZlciBpdFwiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgIHNoYXJlczogMTIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG5cbiAgICBhd2FpdCB0cmFuc2ZlckFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBhcnR3b3JrU2hhcmRJZCxcbiAgICAgIHNpZ25lclBocmFzZTogVVNFUjFfUEhSQVNFLFxuICAgICAgcmVjZWl2ZXJBZGRyZXNzOiBVU0VSMl9BRERSRVNTLFxuICAgICAgcGFja2FnZUlkOiBQQUNLQUdFX0lELFxuICAgIH0pO1xuXG4gICAgY29uc3QgdHJhbnNmZXJyZWRTaGFyZCA9IGF3YWl0IGdldE9iamVjdChhcnR3b3JrU2hhcmRJZCk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHJhbnNmZXJyZWRTaGFyZC5kYXRhLmNvbnRlbnQuZmllbGRzLnNoYXJlcywgXCIxMlwiKTtcbiAgfSkudGltZW91dCgxMF8wMDApO1xuXG4gIGl0KFwic2hvdWxkIHNwbGl0IGEgc3BsaXQgc2hhcmQgYW5kIHRyYW5zZmVyIGl0IHRvIG5ldyBvd25lclwiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCB9ID0gYXdhaXQgbWludEFydHdvcmtTaGFyZCh7XG4gICAgICBhcnR3b3JrSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IEFETUlOX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjJfQUREUkVTUyxcbiAgICAgIHNoYXJlczogMTIsXG4gICAgICBwYWNrYWdlSWQ6IFBBQ0tBR0VfSUQsXG4gICAgICBhZG1pbkNhcElkOiBBRE1JTl9DQVBfSUQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzcGxpdFNoYXJkSWQxID0gYXdhaXQgc3BsaXRBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya1NoYXJkSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IFVTRVIyX1BIUkFTRSxcbiAgICAgIHNoYXJlczogNSxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG9sZFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KGFydHdvcmtTaGFyZElkKTtcbiAgICBjb25zdCBzcGxpdFNoYXJkID0gYXdhaXQgZ2V0T2JqZWN0KHNwbGl0U2hhcmRJZDEuYXJ0d29ya1NoYXJkSWQpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKG9sZFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjdcIik7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2VydC5zdHJpY3RFcXVhbChzcGxpdFNoYXJkLmRhdGEuY29udGVudC5maWVsZHMuc2hhcmVzLCBcIjVcIik7XG5cbiAgICBjb25zdCB0cmFuc2ZlckFydHdvcmtTaGFyZFJlc3BvbnNlID0gYXdhaXQgdHJhbnNmZXJBcnR3b3JrU2hhcmQoe1xuICAgICAgYXJ0d29ya0lkLFxuICAgICAgYXJ0d29ya1NoYXJkSWQ6IHNwbGl0U2hhcmRJZDEuYXJ0d29ya1NoYXJkSWQsXG4gICAgICBzaWduZXJQaHJhc2U6IFVTRVIyX1BIUkFTRSxcbiAgICAgIHJlY2VpdmVyQWRkcmVzczogVVNFUjFfQUREUkVTUyxcbiAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG93bmVkT2JqZWN0cyA9IGF3YWl0IGdldE93bmVkT2JqZWN0cyh0cmFuc2ZlckFydHdvcmtTaGFyZFJlc3BvbnNlLm93bmVyKTtcbiAgICBjb25zdCB0cmFuc2ZlcnJlZFNoYXJkID0gZmluZE9iamVjdElkSW5Pd25lZE9iamVjdExpc3QoXG4gICAgICBvd25lZE9iamVjdHMgYXMgT3duZWRPYmplY3RMaXN0LFxuICAgICAgc3BsaXRTaGFyZElkMS5hcnR3b3JrU2hhcmRJZFxuICAgICk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHJhbnNmZXJyZWRTaGFyZC5kYXRhLm9iamVjdElkLCBzcGxpdFNoYXJkSWQxLmFydHdvcmtTaGFyZElkKTtcbiAgfSkudGltZW91dCgxMF8wMDApO1xufSk7XG4iXX0=