"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitArtworkShard = void 0;
const sui_js_1 = require("@mysten/sui.js");
const findObjectIdWithOwnerAddress_1 = require("./findObjectIdWithOwnerAddress");
const helpers_1 = require("./helpers");
async function splitArtworkShard(params) {
    const { artworkShardId, signerPhrase, shares, packageId } = params;
    const { signer, address } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::split_artwork_shard`,
        arguments: [tx.object(artworkShardId), tx.pure(shares)],
    });
    const txRes = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true,
        },
    });
    (0, helpers_1.handleTransactionResponse)(txRes);
    const newArtworkShardId = (0, findObjectIdWithOwnerAddress_1.findObjectIdWithOwnerAddress)(txRes, address);
    return {
        artworkShardId: newArtworkShardId,
        owner: address,
    };
}
exports.splitArtworkShard = splitArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRfYXJ0d29ya19zaGFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zcGxpdF9hcnR3b3JrX3NoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFrRDtBQUVsRCxpRkFBOEU7QUFDOUUsdUNBQWlFO0FBRzFELEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsTUFBK0I7SUFFL0IsTUFBTSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUNuRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMsd0NBQXdDO1FBQzVELFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4RCxDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztRQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsT0FBTyxFQUFFO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFFSCxJQUFBLG1DQUF5QixFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE1BQU0saUJBQWlCLEdBQUcsSUFBQSwyREFBNEIsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkUsT0FBTztRQUNMLGNBQWMsRUFBRSxpQkFBaUI7UUFDakMsS0FBSyxFQUFFLE9BQU87S0FDZixDQUFDO0FBQ0osQ0FBQztBQTFCRCw4Q0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IGZpbmRPYmplY3RJZFdpdGhPd25lckFkZHJlc3MgfSBmcm9tIFwiLi9maW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzXCI7XG5pbXBvcnQgeyBnZXRTaWduZXIsIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5pbXBvcnQgeyBBcnR3b3JrU2hhcmREZXRhaWxzLCBTcGxpdEFydHdvcmtTaGFyZFBhcmFtcyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzcGxpdEFydHdvcmtTaGFyZChcbiAgcGFyYW1zOiBTcGxpdEFydHdvcmtTaGFyZFBhcmFtc1xuKTogUHJvbWlzZTxBcnR3b3JrU2hhcmREZXRhaWxzPiB7XG4gIGNvbnN0IHsgYXJ0d29ya1NoYXJkSWQsIHNpZ25lclBocmFzZSwgc2hhcmVzLCBwYWNrYWdlSWQgfSA9IHBhcmFtcztcbiAgY29uc3QgeyBzaWduZXIsIGFkZHJlc3MgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7cGFja2FnZUlkfTo6b3Blbl9hcnRfbWFya2V0OjpzcGxpdF9hcnR3b3JrX3NoYXJkYCxcbiAgICBhcmd1bWVudHM6IFt0eC5vYmplY3QoYXJ0d29ya1NoYXJkSWQpLCB0eC5wdXJlKHNoYXJlcyldLFxuICB9KTtcblxuICBjb25zdCB0eFJlcyA9IGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UodHhSZXMpO1xuICBjb25zdCBuZXdBcnR3b3JrU2hhcmRJZCA9IGZpbmRPYmplY3RJZFdpdGhPd25lckFkZHJlc3ModHhSZXMsIGFkZHJlc3MpO1xuICByZXR1cm4ge1xuICAgIGFydHdvcmtTaGFyZElkOiBuZXdBcnR3b3JrU2hhcmRJZCxcbiAgICBvd25lcjogYWRkcmVzcyxcbiAgfTtcbn1cbiJdfQ==