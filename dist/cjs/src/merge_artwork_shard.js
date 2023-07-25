"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeArtworkShard = void 0;
const sui_js_1 = require("@mysten/sui.js");
const helpers_1 = require("./helpers");
async function mergeArtworkShard(params) {
    const { artworkShard1Id, artworkShard2Id, signerPhrase, packageId } = params;
    const { signer, address } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::merge_artwork_shards`,
        arguments: [tx.object(artworkShard1Id), tx.object(artworkShard2Id)],
    });
    const txRes = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true,
        },
    });
    (0, helpers_1.handleTransactionResponse)(txRes);
    return {
        artworkShardId: artworkShard1Id,
        owner: address,
    };
}
exports.mergeArtworkShard = mergeArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VfYXJ0d29ya19zaGFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXJnZV9hcnR3b3JrX3NoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFrRDtBQUVsRCx1Q0FBaUU7QUFHMUQsS0FBSyxVQUFVLGlCQUFpQixDQUNyQyxNQUErQjtJQUUvQixNQUFNLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzdFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQWdCLEVBQUUsQ0FBQztJQUVsQyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEdBQUcsU0FBUyx5Q0FBeUM7UUFDN0QsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3BFLENBQUMsQ0FBQztJQUVILE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQ3hELGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsSUFBSTtTQUNsQjtLQUNGLENBQUMsQ0FBQztJQUVILElBQUEsbUNBQXlCLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsT0FBTztRQUNMLGNBQWMsRUFBRSxlQUFlO1FBQy9CLEtBQUssRUFBRSxPQUFPO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUF6QkQsOENBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBnZXRTaWduZXIsIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBBcnR3b3JrU2hhcmREZXRhaWxzLCBNZXJnZUFydHdvcmtTaGFyZFBhcmFtcyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZXJnZUFydHdvcmtTaGFyZChcbiAgcGFyYW1zOiBNZXJnZUFydHdvcmtTaGFyZFBhcmFtc1xuKTogUHJvbWlzZTxBcnR3b3JrU2hhcmREZXRhaWxzPiB7XG4gIGNvbnN0IHsgYXJ0d29ya1NoYXJkMUlkLCBhcnR3b3JrU2hhcmQySWQsIHNpZ25lclBocmFzZSwgcGFja2FnZUlkIH0gPSBwYXJhbXM7XG4gIGNvbnN0IHsgc2lnbmVyLCBhZGRyZXNzIH0gPSBnZXRTaWduZXIoc2lnbmVyUGhyYXNlKTtcbiAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb25CbG9jaygpO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IGAke3BhY2thZ2VJZH06Om9wZW5fYXJ0X21hcmtldDo6bWVyZ2VfYXJ0d29ya19zaGFyZHNgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhcnR3b3JrU2hhcmQxSWQpLCB0eC5vYmplY3QoYXJ0d29ya1NoYXJkMklkKV0sXG4gIH0pO1xuXG4gIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2hvd0VmZmVjdHM6IHRydWUsXG4gICAgfSxcbiAgfSk7XG5cbiAgaGFuZGxlVHJhbnNhY3Rpb25SZXNwb25zZSh0eFJlcyk7XG4gIHJldHVybiB7XG4gICAgYXJ0d29ya1NoYXJkSWQ6IGFydHdvcmtTaGFyZDFJZCxcbiAgICBvd25lcjogYWRkcmVzcyxcbiAgfTtcbn1cbiJdfQ==