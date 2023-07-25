"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endRequestVoting = void 0;
const sui_js_1 = require("@mysten/sui.js");
const helpers_1 = require("./helpers");
async function endRequestVoting({ voteRequest, packageId, signerPhrase, adminCapId }) {
    const { signer } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::dao::end_request_voting`,
        arguments: [tx.object(adminCapId), tx.object(voteRequest)],
    });
    try {
        const txRes = await signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showEffects: true,
            },
        });
        return (0, sui_js_1.getExecutionStatus)(txRes);
    }
    catch (e) {
        // console.error("Could not end voting request", e);
        throw new Error("Could not end voting request");
    }
}
exports.endRequestVoting = endRequestVoting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kX3JlcXVlc3Rfdm90aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VuZF9yZXF1ZXN0X3ZvdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBc0U7QUFFdEUsdUNBQXNDO0FBUy9CLEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBd0I7SUFDL0csTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMsMkJBQTJCO1FBQy9DLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMzRCxDQUFDLENBQUM7SUFFSCxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7WUFDeEQsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixXQUFXLEVBQUUsdUJBQXVCO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCxXQUFXLEVBQUUsSUFBSTthQUNsQjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBQSwyQkFBa0IsRUFBQyxLQUFLLENBQUMsQ0FBQztLQUNsQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Ysb0RBQW9EO1FBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUF2QkQsNENBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RXhlY3V0aW9uU3RhdHVzLCBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IGdldFNpZ25lciB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuXG50eXBlIEVuZFZvdGVSZXF1ZXN0UGFyYW1zID0geyBcbiAgcGFja2FnZUlkOiBzdHJpbmc7XG4gIGFkbWluQ2FwSWQ6IHN0cmluZztcbiAgdm90ZVJlcXVlc3Q6IHN0cmluZzsgXG4gIHNpZ25lclBocmFzZTogc3RyaW5nO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuZFJlcXVlc3RWb3RpbmcoeyB2b3RlUmVxdWVzdCwgcGFja2FnZUlkLCBzaWduZXJQaHJhc2UsIGFkbWluQ2FwSWQgfTogRW5kVm90ZVJlcXVlc3RQYXJhbXMpIHtcbiAgY29uc3QgeyBzaWduZXIgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7cGFja2FnZUlkfTo6ZGFvOjplbmRfcmVxdWVzdF92b3RpbmdgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhZG1pbkNhcElkKSwgdHgub2JqZWN0KHZvdGVSZXF1ZXN0KV0sXG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHhSZXMgPSBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRFeGVjdXRpb25TdGF0dXModHhSZXMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBlbmQgdm90aW5nIHJlcXVlc3RcIiwgZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGVuZCB2b3RpbmcgcmVxdWVzdFwiKTtcbiAgfVxufVxuXG4iXX0=