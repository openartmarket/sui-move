import { TransactionBlock } from "@mysten/sui.js";
import { ARTWORK_SHARD_TYPE, PUBLISHER_ID } from "./config";
import { ADMIN_PHRASE } from "./config";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19zaGFyZF9kaXNwbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FydHdvcmtfc2hhcmRfZGlzcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV0QyxtRUFBbUU7QUFDbkUsU0FBUyw0QkFBNEIsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLEVBQUUsdUJBQXVCLEdBQUcsRUFBRTtJQUM3RixPQUFPO1FBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztRQUNyRSxNQUFNLEVBQUU7WUFDTixRQUFRO1lBQ1IsZUFBZTtZQUNmLFlBQVk7WUFDWixHQUFHLHNCQUFzQixjQUFjLHVCQUF1QixFQUFFO1lBQ2hFLGdDQUFnQztTQUNqQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLHlCQUF5QjtJQUN0QyxNQUFNLHlCQUF5QixHQUFHLDRCQUE0QixFQUFFLENBQUM7SUFFakUsTUFBTSxFQUFFLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxNQUFNLEVBQUUsK0JBQStCO1FBQ3ZDLFNBQVMsRUFBRTtZQUNULEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDO1NBQzFDO1FBQ0QsYUFBYSxFQUFFLENBQUMsa0JBQWtCLENBQUM7S0FDcEMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSw4QkFBOEI7UUFDdEMsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUM7UUFDaEMsYUFBYSxFQUFFLENBQUMsa0JBQWtCLENBQUM7S0FDcEMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRTVELE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQzFDLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsSUFBSTtTQUNsQjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCx5QkFBeUIsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBBUlRXT1JLX1NIQVJEX1RZUEUsIFBVQkxJU0hFUl9JRCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgQURNSU5fUEhSQVNFIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHlvdSBjYW4gdXBkYXRlIHRvIGNoYW5nZSB0aGUgZGlzcGxheSBmaWVsZHNcbmZ1bmN0aW9uIGdldEFydHdvcmtTaGFyZERpc3BsYXlGaWVsZHMoaW1hZ2VQcm92aWRlclVybFByZWZpeCA9IFwiXCIsIGltYWdlUHJvdmlkZXJVcmxQb3N0Zml4ID0gXCJcIikge1xuICByZXR1cm4ge1xuICAgIGtleXM6IFtcIm5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcImN1cnJlbmN5XCIsIFwiaW1hZ2VfdXJsXCIsIFwicHJvamVjdF91cmxcIl0sXG4gICAgdmFsdWVzOiBbXG4gICAgICBcIntuYW1lfVwiLFxuICAgICAgXCJ7ZGVzY3JpcHRpb259XCIsXG4gICAgICBcIntjdXJyZW5jeX1cIixcbiAgICAgIGAke2ltYWdlUHJvdmlkZXJVcmxQcmVmaXh9e2ltYWdlX3VybH0ke2ltYWdlUHJvdmlkZXJVcmxQb3N0Zml4fWAsXG4gICAgICBcImh0dHBzOi8vd3d3Lm9wZW5hcnRtYXJrZXQuY29tL1wiLFxuICAgIF0sXG4gIH07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUFydHdvcmtTaGFyZERpc3BsYXkoKSB7XG4gIGNvbnN0IGFydHdvcmtTaGFyZERpc3BsYXlGaWVsZHMgPSBnZXRBcnR3b3JrU2hhcmREaXNwbGF5RmllbGRzKCk7XG5cbiAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb25CbG9jaygpO1xuICBjb25zdCB7IHNpZ25lciwgYWRkcmVzcyB9ID0gZ2V0U2lnbmVyKEFETUlOX1BIUkFTRSk7XG4gIGNvbnN0IGFydHdvcmtTaGFyZERpc3BsYXkgPSB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBcIjB4Mjo6ZGlzcGxheTo6bmV3X3dpdGhfZmllbGRzXCIsXG4gICAgYXJndW1lbnRzOiBbXG4gICAgICB0eC5vYmplY3QoUFVCTElTSEVSX0lEKSxcbiAgICAgIHR4LnB1cmUoYXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcy5rZXlzKSxcbiAgICAgIHR4LnB1cmUoYXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcy52YWx1ZXMpLFxuICAgIF0sXG4gICAgdHlwZUFyZ3VtZW50czogW0FSVFdPUktfU0hBUkRfVFlQRV0sXG4gIH0pO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IFwiMHgyOjpkaXNwbGF5Ojp1cGRhdGVfdmVyc2lvblwiLFxuICAgIGFyZ3VtZW50czogW2FydHdvcmtTaGFyZERpc3BsYXldLFxuICAgIHR5cGVBcmd1bWVudHM6IFtBUlRXT1JLX1NIQVJEX1RZUEVdLFxuICB9KTtcblxuICB0eC50cmFuc2Zlck9iamVjdHMoW2FydHdvcmtTaGFyZERpc3BsYXldLCB0eC5wdXJlKGFkZHJlc3MpKTtcblxuICBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICBvcHRpb25zOiB7XG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbn1cblxuY3JlYXRlQXJ0d29ya1NoYXJkRGlzcGxheSgpO1xuIl19