import { TransactionBlock } from "@mysten/sui.js";
import { ADMIN_PHRASE, PUBLISHER_ID } from "../test/test-helpers";
import { ARTWORK_SHARD_TYPE } from "./config";
import { getSigner } from "./helpers";
// This is the function you can update to change the display fields
function getArtworkShardDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
    return {
        keys: ["name", "description", "currency", "image_url", "project_url"],
        values: [
            "{name}",
            "{description}",
            "{currency}",
            `${imageProviderUrlPrefix}{image_url}${imageProviderUrlPostfix}`,
            "https://www.openartmarket.com/",
        ],
    };
}
async function createArtworkShardDisplay() {
    const artworkShardDisplayFields = getArtworkShardDisplayFields();
    const tx = new TransactionBlock();
    const { signer, address } = getSigner(ADMIN_PHRASE);
    const artworkShardDisplay = tx.moveCall({
        target: "0x2::display::new_with_fields",
        arguments: [
            tx.object(PUBLISHER_ID),
            tx.pure(artworkShardDisplayFields.keys),
            tx.pure(artworkShardDisplayFields.values),
        ],
        typeArguments: [ARTWORK_SHARD_TYPE],
    });
    tx.moveCall({
        target: "0x2::display::update_version",
        arguments: [artworkShardDisplay],
        typeArguments: [ARTWORK_SHARD_TYPE],
    });
    tx.transferObjects([artworkShardDisplay], tx.pure(address));
    await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true,
        },
    });
}
createArtworkShardDisplay();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19zaGFyZF9kaXNwbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FydHdvcmtfc2hhcmRfZGlzcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRXRDLG1FQUFtRTtBQUNuRSxTQUFTLDRCQUE0QixDQUFDLHNCQUFzQixHQUFHLEVBQUUsRUFBRSx1QkFBdUIsR0FBRyxFQUFFO0lBQzdGLE9BQU87UUFDTCxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDO1FBQ3JFLE1BQU0sRUFBRTtZQUNOLFFBQVE7WUFDUixlQUFlO1lBQ2YsWUFBWTtZQUNaLEdBQUcsc0JBQXNCLGNBQWMsdUJBQXVCLEVBQUU7WUFDaEUsZ0NBQWdDO1NBQ2pDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxLQUFLLFVBQVUseUJBQXlCO0lBQ3RDLE1BQU0seUJBQXlCLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQztJQUVqRSxNQUFNLEVBQUUsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7SUFDbEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEQsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sRUFBRSwrQkFBK0I7UUFDdkMsU0FBUyxFQUFFO1lBQ1QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUM7WUFDdkMsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUM7U0FDMUM7UUFDRCxhQUFhLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztLQUNwQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLDhCQUE4QjtRQUN0QyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztRQUNoQyxhQUFhLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztLQUNwQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFNUQsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7UUFDMUMsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHlCQUF5QixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IEFETUlOX1BIUkFTRSwgUFVCTElTSEVSX0lEIH0gZnJvbSBcIi4uL3Rlc3QvdGVzdC1oZWxwZXJzXCI7XG5pbXBvcnQgeyBBUlRXT1JLX1NIQVJEX1RZUEUgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IGdldFNpZ25lciB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24geW91IGNhbiB1cGRhdGUgdG8gY2hhbmdlIHRoZSBkaXNwbGF5IGZpZWxkc1xuZnVuY3Rpb24gZ2V0QXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcyhpbWFnZVByb3ZpZGVyVXJsUHJlZml4ID0gXCJcIiwgaW1hZ2VQcm92aWRlclVybFBvc3RmaXggPSBcIlwiKSB7XG4gIHJldHVybiB7XG4gICAga2V5czogW1wibmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwiY3VycmVuY3lcIiwgXCJpbWFnZV91cmxcIiwgXCJwcm9qZWN0X3VybFwiXSxcbiAgICB2YWx1ZXM6IFtcbiAgICAgIFwie25hbWV9XCIsXG4gICAgICBcIntkZXNjcmlwdGlvbn1cIixcbiAgICAgIFwie2N1cnJlbmN5fVwiLFxuICAgICAgYCR7aW1hZ2VQcm92aWRlclVybFByZWZpeH17aW1hZ2VfdXJsfSR7aW1hZ2VQcm92aWRlclVybFBvc3RmaXh9YCxcbiAgICAgIFwiaHR0cHM6Ly93d3cub3BlbmFydG1hcmtldC5jb20vXCIsXG4gICAgXSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXJ0d29ya1NoYXJkRGlzcGxheSgpIHtcbiAgY29uc3QgYXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcyA9IGdldEFydHdvcmtTaGFyZERpc3BsYXlGaWVsZHMoKTtcblxuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG4gIGNvbnN0IHsgc2lnbmVyLCBhZGRyZXNzIH0gPSBnZXRTaWduZXIoQURNSU5fUEhSQVNFKTtcbiAgY29uc3QgYXJ0d29ya1NoYXJkRGlzcGxheSA9IHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IFwiMHgyOjpkaXNwbGF5OjpuZXdfd2l0aF9maWVsZHNcIixcbiAgICBhcmd1bWVudHM6IFtcbiAgICAgIHR4Lm9iamVjdChQVUJMSVNIRVJfSUQpLFxuICAgICAgdHgucHVyZShhcnR3b3JrU2hhcmREaXNwbGF5RmllbGRzLmtleXMpLFxuICAgICAgdHgucHVyZShhcnR3b3JrU2hhcmREaXNwbGF5RmllbGRzLnZhbHVlcyksXG4gICAgXSxcbiAgICB0eXBlQXJndW1lbnRzOiBbQVJUV09SS19TSEFSRF9UWVBFXSxcbiAgfSk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogXCIweDI6OmRpc3BsYXk6OnVwZGF0ZV92ZXJzaW9uXCIsXG4gICAgYXJndW1lbnRzOiBbYXJ0d29ya1NoYXJkRGlzcGxheV0sXG4gICAgdHlwZUFyZ3VtZW50czogW0FSVFdPUktfU0hBUkRfVFlQRV0sXG4gIH0pO1xuXG4gIHR4LnRyYW5zZmVyT2JqZWN0cyhbYXJ0d29ya1NoYXJkRGlzcGxheV0sIHR4LnB1cmUoYWRkcmVzcykpO1xuXG4gIGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xufVxuXG5jcmVhdGVBcnR3b3JrU2hhcmREaXNwbGF5KCk7XG4iXX0=