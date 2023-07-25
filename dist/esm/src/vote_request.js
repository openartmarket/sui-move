import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";
import { getSigner } from "./helpers";
export async function createVoteRequest({ artwork_id, request, adminCapId, packageId, signerPhrase }) {
    // console.log("Mint artwork shard for: %s", artwork_id);
    const { signer } = getSigner(signerPhrase);
    const tx = new TransactionBlock();
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
        const vote_request_id = getCreatedObjects(txRes)?.[0].reference.objectId;
        // console.log("vote request id", vote_request_id);
        return vote_request_id;
    }
    catch (e) {
        // console.error("Could not create vote request", e);
        throw new Error("Could not create vote request");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZV9yZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZvdGVfcmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBVXRDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFxQjtJQUNySCx5REFBeUQ7SUFFekQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMsNEJBQTRCO1FBQ2hELFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFFLENBQUMsQ0FBQztJQUVILElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztZQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1lBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7WUFDcEMsT0FBTyxFQUFFO2dCQUNQLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgscURBQXFEO1FBQ3JELE1BQU0sZUFBZSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUN6RSxtREFBbUQ7UUFDbkQsT0FBTyxlQUFlLENBQUM7S0FDeEI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLHFEQUFxRDtRQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0Q3JlYXRlZE9iamVjdHMsIFRyYW5zYWN0aW9uQmxvY2sgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuaW1wb3J0IHsgZ2V0U2lnbmVyIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuXG50eXBlIFZvdGVSZXF1ZXN0UGFyYW1zID0geyBcbiAgYXJ0d29ya19pZDogc3RyaW5nOyBcbiAgcmVxdWVzdDogc3RyaW5nOyBcbiAgcGFja2FnZUlkOiBzdHJpbmc7XG4gIGFkbWluQ2FwSWQ6IHN0cmluZztcbiAgc2lnbmVyUGhyYXNlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVWb3RlUmVxdWVzdCh7IGFydHdvcmtfaWQsIHJlcXVlc3QsIGFkbWluQ2FwSWQsIHBhY2thZ2VJZCwgc2lnbmVyUGhyYXNlIH06IFZvdGVSZXF1ZXN0UGFyYW1zKSB7XG4gIC8vIGNvbnNvbGUubG9nKFwiTWludCBhcnR3b3JrIHNoYXJkIGZvcjogJXNcIiwgYXJ0d29ya19pZCk7XG5cbiAgY29uc3QgeyBzaWduZXIgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7cGFja2FnZUlkfTo6ZGFvOjpjcmVhdGVfdm90ZV9yZXF1ZXN0YCxcbiAgICBhcmd1bWVudHM6IFt0eC5vYmplY3QoYWRtaW5DYXBJZCksIHR4LnB1cmUoYXJ0d29ya19pZCksIHR4LnB1cmUocmVxdWVzdCldLFxuICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzaG93T2JqZWN0Q2hhbmdlczogdHJ1ZSxcbiAgICAgICAgc2hvd0VmZmVjdHM6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJlZmZlY3RzXCIsIGdldEV4ZWN1dGlvblN0YXR1cyh0eFJlcykpO1xuICAgIGNvbnN0IHZvdGVfcmVxdWVzdF9pZCA9IGdldENyZWF0ZWRPYmplY3RzKHR4UmVzKT8uWzBdLnJlZmVyZW5jZS5vYmplY3RJZDtcbiAgICAvLyBjb25zb2xlLmxvZyhcInZvdGUgcmVxdWVzdCBpZFwiLCB2b3RlX3JlcXVlc3RfaWQpO1xuICAgIHJldHVybiB2b3RlX3JlcXVlc3RfaWQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGNyZWF0ZSB2b3RlIHJlcXVlc3RcIiwgZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGNyZWF0ZSB2b3RlIHJlcXVlc3RcIik7XG4gIH1cbn1cblxuIl19