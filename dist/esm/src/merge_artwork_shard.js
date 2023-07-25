import { TransactionBlock } from "@mysten/sui.js";
import { getSigner, handleTransactionResponse } from "./helpers";
export async function mergeArtworkShard(params) {
    const { artworkShard1Id, artworkShard2Id, signerPhrase, packageId } = params;
    const { signer, address } = getSigner(signerPhrase);
    const tx = new TransactionBlock();
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
    handleTransactionResponse(txRes);
    return {
        artworkShardId: artworkShard1Id,
        owner: address,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VfYXJ0d29ya19zaGFyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXJnZV9hcnR3b3JrX3NoYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxELE9BQU8sRUFBRSxTQUFTLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHakUsTUFBTSxDQUFDLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsTUFBK0I7SUFFL0IsTUFBTSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUM3RSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwRCxNQUFNLEVBQUUsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMseUNBQXlDO1FBQzdELFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNwRSxDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztRQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsT0FBTyxFQUFFO1lBQ1AsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFFSCx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxPQUFPO1FBQ0wsY0FBYyxFQUFFLGVBQWU7UUFDL0IsS0FBSyxFQUFFLE9BQU87S0FDZixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyYW5zYWN0aW9uQmxvY2sgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuaW1wb3J0IHsgZ2V0U2lnbmVyLCBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgQXJ0d29ya1NoYXJkRGV0YWlscywgTWVyZ2VBcnR3b3JrU2hhcmRQYXJhbXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWVyZ2VBcnR3b3JrU2hhcmQoXG4gIHBhcmFtczogTWVyZ2VBcnR3b3JrU2hhcmRQYXJhbXNcbik6IFByb21pc2U8QXJ0d29ya1NoYXJkRGV0YWlscz4ge1xuICBjb25zdCB7IGFydHdvcmtTaGFyZDFJZCwgYXJ0d29ya1NoYXJkMklkLCBzaWduZXJQaHJhc2UsIHBhY2thZ2VJZCB9ID0gcGFyYW1zO1xuICBjb25zdCB7IHNpZ25lciwgYWRkcmVzcyB9ID0gZ2V0U2lnbmVyKHNpZ25lclBocmFzZSk7XG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcblxuICB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBgJHtwYWNrYWdlSWR9OjpvcGVuX2FydF9tYXJrZXQ6Om1lcmdlX2FydHdvcmtfc2hhcmRzYCxcbiAgICBhcmd1bWVudHM6IFt0eC5vYmplY3QoYXJ0d29ya1NoYXJkMUlkKSwgdHgub2JqZWN0KGFydHdvcmtTaGFyZDJJZCldLFxuICB9KTtcblxuICBjb25zdCB0eFJlcyA9IGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UodHhSZXMpO1xuICByZXR1cm4ge1xuICAgIGFydHdvcmtTaGFyZElkOiBhcnR3b3JrU2hhcmQxSWQsXG4gICAgb3duZXI6IGFkZHJlc3MsXG4gIH07XG59XG4iXX0=