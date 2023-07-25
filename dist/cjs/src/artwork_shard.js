"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintArtworkShard = void 0;
const sui_js_1 = require("@mysten/sui.js");
const findObjectIdWithOwnerAddress_1 = require("./findObjectIdWithOwnerAddress");
const helpers_1 = require("./helpers");
/**
 * Mints an artwork shard
 * @returns artwork shard id
 */
async function mintArtworkShard(params) {
    const { artworkId, signerPhrase, recieverPhrase, packageId, adminCapId, shares } = params;
    const { signer } = (0, helpers_1.getSigner)(signerPhrase);
    const { address } = (0, helpers_1.getSigner)(recieverPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::mint_artwork_shard`,
        arguments: [tx.object(adminCapId), tx.object(artworkId), tx.pure(shares), tx.pure(address)],
    });
    const txRes = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
        },
    });
    const artworkShardId = (0, findObjectIdWithOwnerAddress_1.findObjectIdWithOwnerAddress)(txRes, address);
    const { digest } = txRes;
    return { artworkShardId, digest };
}
exports.mintArtworkShard = mintArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19zaGFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcnR3b3JrX3NoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFrRDtBQUVsRCxpRkFBNEU7QUFDNUUsdUNBQXNDO0FBZ0J0Qzs7O0dBR0c7QUFDSSxLQUFLLFVBQVUsZ0JBQWdCLENBQ3BDLE1BQThCO0lBRTlCLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUMxRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLG1CQUFTLEVBQUMsY0FBYyxDQUFDLENBQUM7SUFDOUMsTUFBTSxFQUFFLEdBQUcsSUFBSSx5QkFBZ0IsRUFBRSxDQUFDO0lBRWxDLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDVixNQUFNLEVBQUUsR0FBRyxTQUFTLHVDQUF1QztRQUMzRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVGLENBQUMsQ0FBQztJQUVILE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQ3hELGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUU7WUFDUCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxjQUFjLEdBQUcsSUFBQSwyREFBNEIsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDbkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUN6QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3BDLENBQUM7QUF6QkQsNENBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBmaW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzfSBmcm9tIFwiLi9maW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzXCJcbmltcG9ydCB7IGdldFNpZ25lciB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZXhwb3J0IHR5cGUgTWludEFydHdvcmtTaGFyZFBhcmFtcyA9IHtcbiAgcGFja2FnZUlkOiBzdHJpbmc7XG4gIGFkbWluQ2FwSWQ6IHN0cmluZztcbiAgYXJ0d29ya0lkOiBzdHJpbmc7XG4gIHNpZ25lclBocmFzZTogc3RyaW5nO1xuICByZWNpZXZlclBocmFzZTogc3RyaW5nO1xuICBzaGFyZXM6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIE1pbnRBcnR3b3JrU2hhcmRSZXN1bHQgPSB7XG4gIGFydHdvcmtTaGFyZElkOiBzdHJpbmc7XG4gIGRpZ2VzdDogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBNaW50cyBhbiBhcnR3b3JrIHNoYXJkXG4gKiBAcmV0dXJucyBhcnR3b3JrIHNoYXJkIGlkXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW50QXJ0d29ya1NoYXJkKFxuICBwYXJhbXM6IE1pbnRBcnR3b3JrU2hhcmRQYXJhbXNcbik6IFByb21pc2U8TWludEFydHdvcmtTaGFyZFJlc3VsdD4ge1xuICBjb25zdCB7IGFydHdvcmtJZCwgc2lnbmVyUGhyYXNlLCByZWNpZXZlclBocmFzZSwgcGFja2FnZUlkLCBhZG1pbkNhcElkLCBzaGFyZXMgfSA9IHBhcmFtcztcbiAgY29uc3QgeyBzaWduZXIgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB7IGFkZHJlc3MgfSA9IGdldFNpZ25lcihyZWNpZXZlclBocmFzZSk7XG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcblxuICB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBgJHtwYWNrYWdlSWR9OjpvcGVuX2FydF9tYXJrZXQ6Om1pbnRfYXJ0d29ya19zaGFyZGAsXG4gICAgYXJndW1lbnRzOiBbdHgub2JqZWN0KGFkbWluQ2FwSWQpLCB0eC5vYmplY3QoYXJ0d29ya0lkKSwgdHgucHVyZShzaGFyZXMpLCB0eC5wdXJlKGFkZHJlc3MpXSxcbiAgfSk7XG5cbiAgY29uc3QgdHhSZXMgPSBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICBvcHRpb25zOiB7XG4gICAgICBzaG93T2JqZWN0Q2hhbmdlczogdHJ1ZSxcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IGFydHdvcmtTaGFyZElkID0gZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzcyh0eFJlcywgYWRkcmVzcylcbiAgY29uc3QgeyBkaWdlc3QgfSA9IHR4UmVzO1xuICByZXR1cm4geyBhcnR3b3JrU2hhcmRJZCwgZGlnZXN0IH07XG59XG5cblxuIl19