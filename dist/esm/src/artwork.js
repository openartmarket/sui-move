import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";
import { getSigner, handleTransactionResponse } from "./helpers";
/**
 * Mints a new artwork
 * @param params
 * @returns the artwork id
 */
export async function mintArtwork(params) {
    const { adminCapId, packageId, signerPhrase, totalSupply, sharePrice, multiplier, name, artist, creationDate, description, currency, image, } = params;
    // console.log("Mint artwork: %s", name + " by " + artist);
    const { signer } = getSigner(signerPhrase);
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::mint_artwork_and_share`,
        arguments: [
            tx.object(adminCapId),
            tx.pure(totalSupply),
            tx.pure(sharePrice),
            tx.pure(multiplier),
            tx.pure(name),
            tx.pure(artist),
            tx.pure(creationDate),
            tx.pure(description),
            tx.pure(currency),
            tx.pure(image),
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
    handleTransactionResponse(txRes);
    const artworkId = getCreatedObjects(txRes)?.[0].reference.objectId;
    if (!artworkId)
        throw new Error("Could not mint artwork");
    return artworkId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcnR3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJFLE9BQU8sRUFBRSxTQUFTLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFakU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQXlCO0lBQ3pELE1BQU0sRUFDSixVQUFVLEVBQ1YsU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLEVBQ1gsVUFBVSxFQUNWLFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLFlBQVksRUFDWixXQUFXLEVBQ1gsUUFBUSxFQUNSLEtBQUssR0FDTixHQUFHLE1BQU0sQ0FBQztJQUVYLDJEQUEyRDtJQUUzRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLE1BQU0sRUFBRSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUVsQyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLEdBQUcsU0FBUywyQ0FBMkM7UUFDL0QsU0FBUyxFQUFFO1lBQ1QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDckIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDYixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNmLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ2Y7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQztRQUN4RCxnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsT0FBTyxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixXQUFXLEVBQUUsSUFBSTtTQUNsQjtLQUNGLENBQUMsQ0FBQztJQUVILHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNuRSxJQUFJLENBQUMsU0FBUztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUUxRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0Q3JlYXRlZE9iamVjdHMsIFRyYW5zYWN0aW9uQmxvY2sgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuaW1wb3J0IHsgZ2V0U2lnbmVyLCBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgTWludEFydHdvcmtQYXJhbXMgfSBmcm9tIFwiLi90eXBlc1wiO1xuLyoqXG4gKiBNaW50cyBhIG5ldyBhcnR3b3JrXG4gKiBAcGFyYW0gcGFyYW1zXG4gKiBAcmV0dXJucyB0aGUgYXJ0d29yayBpZFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWludEFydHdvcmsocGFyYW1zOiBNaW50QXJ0d29ya1BhcmFtcyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHtcbiAgICBhZG1pbkNhcElkLFxuICAgIHBhY2thZ2VJZCxcbiAgICBzaWduZXJQaHJhc2UsXG4gICAgdG90YWxTdXBwbHksXG4gICAgc2hhcmVQcmljZSxcbiAgICBtdWx0aXBsaWVyLFxuICAgIG5hbWUsXG4gICAgYXJ0aXN0LFxuICAgIGNyZWF0aW9uRGF0ZSxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBjdXJyZW5jeSxcbiAgICBpbWFnZSxcbiAgfSA9IHBhcmFtcztcblxuICAvLyBjb25zb2xlLmxvZyhcIk1pbnQgYXJ0d29yazogJXNcIiwgbmFtZSArIFwiIGJ5IFwiICsgYXJ0aXN0KTtcblxuICBjb25zdCB7IHNpZ25lciB9ID0gZ2V0U2lnbmVyKHNpZ25lclBocmFzZSk7XG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcblxuICB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBgJHtwYWNrYWdlSWR9OjpvcGVuX2FydF9tYXJrZXQ6Om1pbnRfYXJ0d29ya19hbmRfc2hhcmVgLFxuICAgIGFyZ3VtZW50czogW1xuICAgICAgdHgub2JqZWN0KGFkbWluQ2FwSWQpLFxuICAgICAgdHgucHVyZSh0b3RhbFN1cHBseSksXG4gICAgICB0eC5wdXJlKHNoYXJlUHJpY2UpLFxuICAgICAgdHgucHVyZShtdWx0aXBsaWVyKSxcbiAgICAgIHR4LnB1cmUobmFtZSksXG4gICAgICB0eC5wdXJlKGFydGlzdCksXG4gICAgICB0eC5wdXJlKGNyZWF0aW9uRGF0ZSksXG4gICAgICB0eC5wdXJlKGRlc2NyaXB0aW9uKSxcbiAgICAgIHR4LnB1cmUoY3VycmVuY3kpLFxuICAgICAgdHgucHVyZShpbWFnZSksXG4gICAgXSxcbiAgfSk7XG5cbiAgY29uc3QgdHhSZXMgPSBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICBvcHRpb25zOiB7XG4gICAgICBzaG93T2JqZWN0Q2hhbmdlczogdHJ1ZSxcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xuXG4gIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UodHhSZXMpO1xuICBjb25zdCBhcnR3b3JrSWQgPSBnZXRDcmVhdGVkT2JqZWN0cyh0eFJlcyk/LlswXS5yZWZlcmVuY2Uub2JqZWN0SWQ7XG4gIGlmICghYXJ0d29ya0lkKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgbWludCBhcnR3b3JrXCIpO1xuXG4gIHJldHVybiBhcnR3b3JrSWQ7XG59XG4iXX0=