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
    const { artworkId, signerPhrase, receiverAddress, packageId, adminCapId, shares } = params;
    const { signer } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::mint_artwork_shard`,
        arguments: [
            tx.object(adminCapId),
            tx.object(artworkId),
            tx.pure(shares),
            tx.pure(receiverAddress),
        ],
    });
    const txRes = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showObjectChanges: true,
            showEffects: true,
        },
    });
    (0, helpers_1.handleTransactionResponse)(txRes);
    const artworkShardId = (0, findObjectIdWithOwnerAddress_1.findObjectIdWithOwnerAddress)(txRes, receiverAddress);
    const { digest } = txRes;
    return { artworkShardId, digest, owner: receiverAddress };
}
exports.mintArtworkShard = mintArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19zaGFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcnR3b3JrX3NoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFrRDtBQUVsRCxpRkFBOEU7QUFDOUUsdUNBQWlFO0FBR2pFOzs7R0FHRztBQUNJLEtBQUssVUFBVSxnQkFBZ0IsQ0FDcEMsTUFBOEI7SUFFOUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzNGLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLG1CQUFTLEVBQUMsWUFBWSxDQUFDLENBQUM7SUFFM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSx5QkFBZ0IsRUFBRSxDQUFDO0lBRWxDLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDVixNQUFNLEVBQUUsR0FBRyxTQUFTLHVDQUF1QztRQUMzRCxTQUFTLEVBQUU7WUFDVCxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNmLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ3pCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7UUFDeEQsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLE9BQU8sRUFBRTtZQUNQLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFBLG1DQUF5QixFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUEsMkRBQTRCLEVBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDekIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxDQUFDO0FBQzVELENBQUM7QUE5QkQsNENBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBmaW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzIH0gZnJvbSBcIi4vZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzc1wiO1xuaW1wb3J0IHsgZ2V0U2lnbmVyLCBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgTWludEFydHdvcmtTaGFyZFBhcmFtcywgTWludEFydHdvcmtTaGFyZFJlc3VsdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogTWludHMgYW4gYXJ0d29yayBzaGFyZFxuICogQHJldHVybnMgYXJ0d29yayBzaGFyZCBpZFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWludEFydHdvcmtTaGFyZChcbiAgcGFyYW1zOiBNaW50QXJ0d29ya1NoYXJkUGFyYW1zXG4pOiBQcm9taXNlPE1pbnRBcnR3b3JrU2hhcmRSZXN1bHQ+IHtcbiAgY29uc3QgeyBhcnR3b3JrSWQsIHNpZ25lclBocmFzZSwgcmVjZWl2ZXJBZGRyZXNzLCBwYWNrYWdlSWQsIGFkbWluQ2FwSWQsIHNoYXJlcyB9ID0gcGFyYW1zO1xuICBjb25zdCB7IHNpZ25lciB9ID0gZ2V0U2lnbmVyKHNpZ25lclBocmFzZSk7XG5cbiAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb25CbG9jaygpO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IGAke3BhY2thZ2VJZH06Om9wZW5fYXJ0X21hcmtldDo6bWludF9hcnR3b3JrX3NoYXJkYCxcbiAgICBhcmd1bWVudHM6IFtcbiAgICAgIHR4Lm9iamVjdChhZG1pbkNhcElkKSxcbiAgICAgIHR4Lm9iamVjdChhcnR3b3JrSWQpLFxuICAgICAgdHgucHVyZShzaGFyZXMpLFxuICAgICAgdHgucHVyZShyZWNlaXZlckFkZHJlc3MpLFxuICAgIF0sXG4gIH0pO1xuXG4gIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2hvd09iamVjdENoYW5nZXM6IHRydWUsXG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbiAgaGFuZGxlVHJhbnNhY3Rpb25SZXNwb25zZSh0eFJlcyk7XG4gIGNvbnN0IGFydHdvcmtTaGFyZElkID0gZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzcyh0eFJlcywgcmVjZWl2ZXJBZGRyZXNzKTtcbiAgY29uc3QgeyBkaWdlc3QgfSA9IHR4UmVzO1xuICByZXR1cm4geyBhcnR3b3JrU2hhcmRJZCwgZGlnZXN0LCBvd25lcjogcmVjZWl2ZXJBZGRyZXNzIH07XG59XG4iXX0=