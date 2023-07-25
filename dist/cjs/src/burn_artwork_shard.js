"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnArtworkShard = void 0;
const sui_js_1 = require("@mysten/sui.js");
const config_1 = require("./config");
const helpers_1 = require("./helpers");
async function burnArtworkShard(params) {
    const { artworkShardId, artworkId, signerPhrase } = params;
    const { signer, address } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${config_1.PACKAGE_ID}::open_art_market::safe_burn_artwork_shard`,
        arguments: [tx.object(artworkId), tx.object(artworkShardId)],
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
        artworkShardId,
        success: true,
        owner: address,
    };
}
exports.burnArtworkShard = burnArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVybl9hcnR3b3JrX3NoYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1cm5fYXJ0d29ya19zaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBa0Q7QUFFbEQscUNBQXNDO0FBQ3RDLHVDQUFpRTtBQUcxRCxLQUFLLFVBQVUsZ0JBQWdCLENBQUMsTUFBeUI7SUFDOUQsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzNELE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQWdCLEVBQUUsQ0FBQztJQUVsQyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEdBQUcsbUJBQVUsNENBQTRDO1FBQ2pFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUM3RCxDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztRQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsT0FBTyxFQUFFO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFBLG1DQUF5QixFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE9BQU87UUFDTCxjQUFjO1FBQ2QsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsT0FBTztLQUNmLENBQUM7QUFDSixDQUFDO0FBdkJELDRDQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zYWN0aW9uQmxvY2sgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgZ2V0U2lnbmVyLCBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgQnVybkFydHdvcmtQYXJhbXMsIEJ1cm5BcnR3b3JrUmVzdWx0IH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1cm5BcnR3b3JrU2hhcmQocGFyYW1zOiBCdXJuQXJ0d29ya1BhcmFtcyk6IFByb21pc2U8QnVybkFydHdvcmtSZXN1bHQ+IHtcbiAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCwgYXJ0d29ya0lkLCBzaWduZXJQaHJhc2UgfSA9IHBhcmFtcztcbiAgY29uc3QgeyBzaWduZXIsIGFkZHJlc3MgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7UEFDS0FHRV9JRH06Om9wZW5fYXJ0X21hcmtldDo6c2FmZV9idXJuX2FydHdvcmtfc2hhcmRgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhcnR3b3JrSWQpLCB0eC5vYmplY3QoYXJ0d29ya1NoYXJkSWQpXSxcbiAgfSk7XG5cbiAgY29uc3QgdHhSZXMgPSBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICBvcHRpb25zOiB7XG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbiAgaGFuZGxlVHJhbnNhY3Rpb25SZXNwb25zZSh0eFJlcyk7XG4gIHJldHVybiB7XG4gICAgYXJ0d29ya1NoYXJkSWQsXG4gICAgc3VjY2VzczogdHJ1ZSxcbiAgICBvd25lcjogYWRkcmVzcyxcbiAgfTtcbn1cbiJdfQ==