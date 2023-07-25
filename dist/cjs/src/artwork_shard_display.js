"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sui_js_1 = require("@mysten/sui.js");
const config_1 = require("./config");
const config_2 = require("./config");
const helpers_1 = require("./helpers");
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
    const tx = new sui_js_1.TransactionBlock();
    const { signer, address } = (0, helpers_1.getSigner)(config_2.ADMIN_PHRASE);
    const artworkShardDisplay = tx.moveCall({
        target: "0x2::display::new_with_fields",
        arguments: [
            tx.object(config_1.PUBLISHER_ID),
            tx.pure(artworkShardDisplayFields.keys),
            tx.pure(artworkShardDisplayFields.values),
        ],
        typeArguments: [config_1.ARTWORK_SHARD_TYPE],
    });
    tx.moveCall({
        target: "0x2::display::update_version",
        arguments: [artworkShardDisplay],
        typeArguments: [config_1.ARTWORK_SHARD_TYPE],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19zaGFyZF9kaXNwbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FydHdvcmtfc2hhcmRfZGlzcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFrRDtBQUVsRCxxQ0FBNEQ7QUFDNUQscUNBQXdDO0FBQ3hDLHVDQUFzQztBQUV0QyxtRUFBbUU7QUFDbkUsU0FBUyw0QkFBNEIsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLEVBQUUsdUJBQXVCLEdBQUcsRUFBRTtJQUM3RixPQUFPO1FBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQztRQUNyRSxNQUFNLEVBQUU7WUFDTixRQUFRO1lBQ1IsZUFBZTtZQUNmLFlBQVk7WUFDWixHQUFHLHNCQUFzQixjQUFjLHVCQUF1QixFQUFFO1lBQ2hFLGdDQUFnQztTQUNqQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLHlCQUF5QjtJQUN0QyxNQUFNLHlCQUF5QixHQUFHLDRCQUE0QixFQUFFLENBQUM7SUFFakUsTUFBTSxFQUFFLEdBQUcsSUFBSSx5QkFBZ0IsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxtQkFBUyxFQUFDLHFCQUFZLENBQUMsQ0FBQztJQUNwRCxNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDdEMsTUFBTSxFQUFFLCtCQUErQjtRQUN2QyxTQUFTLEVBQUU7WUFDVCxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFZLENBQUM7WUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUM7WUFDdkMsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUM7U0FDMUM7UUFDRCxhQUFhLEVBQUUsQ0FBQywyQkFBa0IsQ0FBQztLQUNwQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1YsTUFBTSxFQUFFLDhCQUE4QjtRQUN0QyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztRQUNoQyxhQUFhLEVBQUUsQ0FBQywyQkFBa0IsQ0FBQztLQUNwQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFNUQsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7UUFDMUMsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHlCQUF5QixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IEFSVFdPUktfU0hBUkRfVFlQRSwgUFVCTElTSEVSX0lEIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBBRE1JTl9QSFJBU0UgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IGdldFNpZ25lciB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuLy8gVGhpcyBpcyB0aGUgZnVuY3Rpb24geW91IGNhbiB1cGRhdGUgdG8gY2hhbmdlIHRoZSBkaXNwbGF5IGZpZWxkc1xuZnVuY3Rpb24gZ2V0QXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcyhpbWFnZVByb3ZpZGVyVXJsUHJlZml4ID0gXCJcIiwgaW1hZ2VQcm92aWRlclVybFBvc3RmaXggPSBcIlwiKSB7XG4gIHJldHVybiB7XG4gICAga2V5czogW1wibmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwiY3VycmVuY3lcIiwgXCJpbWFnZV91cmxcIiwgXCJwcm9qZWN0X3VybFwiXSxcbiAgICB2YWx1ZXM6IFtcbiAgICAgIFwie25hbWV9XCIsXG4gICAgICBcIntkZXNjcmlwdGlvbn1cIixcbiAgICAgIFwie2N1cnJlbmN5fVwiLFxuICAgICAgYCR7aW1hZ2VQcm92aWRlclVybFByZWZpeH17aW1hZ2VfdXJsfSR7aW1hZ2VQcm92aWRlclVybFBvc3RmaXh9YCxcbiAgICAgIFwiaHR0cHM6Ly93d3cub3BlbmFydG1hcmtldC5jb20vXCIsXG4gICAgXSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQXJ0d29ya1NoYXJkRGlzcGxheSgpIHtcbiAgY29uc3QgYXJ0d29ya1NoYXJkRGlzcGxheUZpZWxkcyA9IGdldEFydHdvcmtTaGFyZERpc3BsYXlGaWVsZHMoKTtcblxuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG4gIGNvbnN0IHsgc2lnbmVyLCBhZGRyZXNzIH0gPSBnZXRTaWduZXIoQURNSU5fUEhSQVNFKTtcbiAgY29uc3QgYXJ0d29ya1NoYXJkRGlzcGxheSA9IHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IFwiMHgyOjpkaXNwbGF5OjpuZXdfd2l0aF9maWVsZHNcIixcbiAgICBhcmd1bWVudHM6IFtcbiAgICAgIHR4Lm9iamVjdChQVUJMSVNIRVJfSUQpLFxuICAgICAgdHgucHVyZShhcnR3b3JrU2hhcmREaXNwbGF5RmllbGRzLmtleXMpLFxuICAgICAgdHgucHVyZShhcnR3b3JrU2hhcmREaXNwbGF5RmllbGRzLnZhbHVlcyksXG4gICAgXSxcbiAgICB0eXBlQXJndW1lbnRzOiBbQVJUV09SS19TSEFSRF9UWVBFXSxcbiAgfSk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogXCIweDI6OmRpc3BsYXk6OnVwZGF0ZV92ZXJzaW9uXCIsXG4gICAgYXJndW1lbnRzOiBbYXJ0d29ya1NoYXJkRGlzcGxheV0sXG4gICAgdHlwZUFyZ3VtZW50czogW0FSVFdPUktfU0hBUkRfVFlQRV0sXG4gIH0pO1xuXG4gIHR4LnRyYW5zZmVyT2JqZWN0cyhbYXJ0d29ya1NoYXJkRGlzcGxheV0sIHR4LnB1cmUoYWRkcmVzcykpO1xuXG4gIGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgIHRyYW5zYWN0aW9uQmxvY2s6IHR4LFxuICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHNob3dFZmZlY3RzOiB0cnVlLFxuICAgIH0sXG4gIH0pO1xufVxuXG5jcmVhdGVBcnR3b3JrU2hhcmREaXNwbGF5KCk7XG4iXX0=