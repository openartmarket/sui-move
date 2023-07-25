"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoteRequest = void 0;
const sui_js_1 = require("@mysten/sui.js");
const helpers_1 = require("./helpers");
async function createVoteRequest({ artwork_id, request, adminCapId, packageId, signerPhrase }) {
    // console.log("Mint artwork shard for: %s", artwork_id);
    const { signer } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::dao::create_vote_request`,
        arguments: [tx.object(adminCapId), tx.pure(artwork_id), tx.pure(request)],
    });
    try {
        const txRes = await signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showObjectChanges: true,
                showEffects: true,
            },
        });
        // console.log("effects", getExecutionStatus(txRes));
        const vote_request_id = (0, sui_js_1.getCreatedObjects)(txRes)?.[0].reference.objectId;
        // console.log("vote request id", vote_request_id);
        return vote_request_id;
    }
    catch (e) {
        // console.error("Could not create vote request", e);
        throw new Error("Could not create vote request");
    }
}
exports.createVoteRequest = createVoteRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZV9yZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZvdGVfcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBcUU7QUFFckUsdUNBQXNDO0FBVS9CLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQXFCO0lBQ3JILHlEQUF5RDtJQUV6RCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLElBQUkseUJBQWdCLEVBQUUsQ0FBQztJQUVsQyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEdBQUcsU0FBUyw0QkFBNEI7UUFDaEQsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUUsQ0FBQyxDQUFDO0lBRUgsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1lBQ3hELGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxPQUFPLEVBQUU7Z0JBQ1AsaUJBQWlCLEVBQUUsSUFBSTtnQkFDdkIsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFFSCxxREFBcUQ7UUFDckQsTUFBTSxlQUFlLEdBQUcsSUFBQSwwQkFBaUIsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDekUsbURBQW1EO1FBQ25ELE9BQU8sZUFBZSxDQUFDO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixxREFBcUQ7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQ2xEO0FBQ0gsQ0FBQztBQTdCRCw4Q0E2QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRDcmVhdGVkT2JqZWN0cywgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbnR5cGUgVm90ZVJlcXVlc3RQYXJhbXMgPSB7IFxuICBhcnR3b3JrX2lkOiBzdHJpbmc7IFxuICByZXF1ZXN0OiBzdHJpbmc7IFxuICBwYWNrYWdlSWQ6IHN0cmluZztcbiAgYWRtaW5DYXBJZDogc3RyaW5nO1xuICBzaWduZXJQaHJhc2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVZvdGVSZXF1ZXN0KHsgYXJ0d29ya19pZCwgcmVxdWVzdCwgYWRtaW5DYXBJZCwgcGFja2FnZUlkLCBzaWduZXJQaHJhc2UgfTogVm90ZVJlcXVlc3RQYXJhbXMpIHtcbiAgLy8gY29uc29sZS5sb2coXCJNaW50IGFydHdvcmsgc2hhcmQgZm9yOiAlc1wiLCBhcnR3b3JrX2lkKTtcblxuICBjb25zdCB7IHNpZ25lciB9ID0gZ2V0U2lnbmVyKHNpZ25lclBocmFzZSk7XG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcblxuICB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBgJHtwYWNrYWdlSWR9OjpkYW86OmNyZWF0ZV92b3RlX3JlcXVlc3RgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhZG1pbkNhcElkKSwgdHgucHVyZShhcnR3b3JrX2lkKSwgdHgucHVyZShyZXF1ZXN0KV0sXG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdHhSZXMgPSBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHNob3dPYmplY3RDaGFuZ2VzOiB0cnVlLFxuICAgICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcImVmZmVjdHNcIiwgZ2V0RXhlY3V0aW9uU3RhdHVzKHR4UmVzKSk7XG4gICAgY29uc3Qgdm90ZV9yZXF1ZXN0X2lkID0gZ2V0Q3JlYXRlZE9iamVjdHModHhSZXMpPy5bMF0ucmVmZXJlbmNlLm9iamVjdElkO1xuICAgIC8vIGNvbnNvbGUubG9nKFwidm90ZSByZXF1ZXN0IGlkXCIsIHZvdGVfcmVxdWVzdF9pZCk7XG4gICAgcmV0dXJuIHZvdGVfcmVxdWVzdF9pZDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIHZvdGUgcmVxdWVzdFwiLCBlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIHZvdGUgcmVxdWVzdFwiKTtcbiAgfVxufVxuXG4iXX0=