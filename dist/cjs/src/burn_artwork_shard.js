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
    const status = (0, sui_js_1.getExecutionStatus)(txRes);
    if (status === undefined) {
        throw new Error("Failed to get execution status");
    }
    if (status.error) {
        throw new Error(status.error);
    }
    if (status.status !== "success") {
        throw new Error(`Transaction failed with status: ${status.status}`);
    }
    return {
        success: true,
        owner: address
    };
}
exports.burnArtworkShard = burnArtworkShard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVybl9hcnR3b3JrX3NoYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2J1cm5fYXJ0d29ya19zaGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBc0U7QUFFdEUscUNBQXNDO0FBQ3RDLHVDQUFzQztBQVkvQixLQUFLLFVBQVUsZ0JBQWdCLENBQUUsTUFBd0I7SUFDOUQsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzNELE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQWdCLEVBQUUsQ0FBQztJQUVsQyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEdBQUcsbUJBQVUsNENBQTRDO1FBQ2pFLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztRQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsT0FBTyxFQUFFO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFBLDJCQUFrQixFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLElBQUcsTUFBTSxLQUFLLFNBQVMsRUFBRTtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDbkQ7SUFDRCxJQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDckU7SUFDRCxPQUFPO1FBQ0wsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsT0FBTztLQUVmLENBQUM7QUFDSixDQUFDO0FBakNELDRDQWlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEV4ZWN1dGlvblN0YXR1cywgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBQQUNLQUdFX0lEIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbmV4cG9ydCB0eXBlIEJ1cm5BcnR3b3JrUGFyYW1zID0ge1xuICBhcnR3b3JrSWQ6IHN0cmluZyxcbiAgYXJ0d29ya1NoYXJkSWQ6IHN0cmluZyxcbiAgc2lnbmVyUGhyYXNlOiBzdHJpbmcsXG59XG5leHBvcnQgdHlwZSBCdXJuQXJ0d29ya1Jlc3VsdCA9IHtcbiAgc3VjY2VzczogYm9vbGVhbixcbiAgb3duZXI6IHN0cmluZ1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVybkFydHdvcmtTaGFyZCggcGFyYW1zOkJ1cm5BcnR3b3JrUGFyYW1zICk6IFByb21pc2U8QnVybkFydHdvcmtSZXN1bHQ+IHtcbiAgY29uc3QgeyBhcnR3b3JrU2hhcmRJZCwgYXJ0d29ya0lkLCBzaWduZXJQaHJhc2UgfSA9IHBhcmFtcztcbiAgY29uc3QgeyBzaWduZXIsIGFkZHJlc3MgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7UEFDS0FHRV9JRH06Om9wZW5fYXJ0X21hcmtldDo6c2FmZV9idXJuX2FydHdvcmtfc2hhcmRgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhcnR3b3JrSWQpLHR4Lm9iamVjdChhcnR3b3JrU2hhcmRJZCldLFxuICB9KTtcblxuICBjb25zdCB0eFJlcyA9IGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHN0YXR1cyA9IGdldEV4ZWN1dGlvblN0YXR1cyh0eFJlcyk7XG4gIGlmKHN0YXR1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBleGVjdXRpb24gc3RhdHVzXCIpO1xuICB9XG4gIGlmKHN0YXR1cy5lcnJvcikge1xuICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMuZXJyb3IpO1xuICB9XG4gIGlmKHN0YXR1cy5zdGF0dXMgIT09IFwic3VjY2Vzc1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUcmFuc2FjdGlvbiBmYWlsZWQgd2l0aCBzdGF0dXM6ICR7c3RhdHVzLnN0YXR1c31gKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgb3duZXI6IGFkZHJlc3NcblxuICB9O1xufVxuIl19