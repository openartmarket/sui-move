import { TransactionBlock } from "@mysten/sui.js";
import { ARTWORK_TYPE, PUBLISHER_ID } from "./config";
import { ADMIN_PHRASE } from "./config";
import { getSigner } from "./helpers";
// This is the function you can update to change the display fields
function getArtworkDisplayFields(imageProviderUrlPrefix = "", imageProviderUrlPostfix = "") {
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
async function createArtworkDisplay() {
    const artworkDisplayFields = getArtworkDisplayFields();
    const tx = new TransactionBlock();
    const { signer, address } = getSigner(ADMIN_PHRASE);
    const artworkDisplay = tx.moveCall({
        target: "0x2::display::new_with_fields",
        arguments: [
            tx.object(PUBLISHER_ID),
            tx.pure(artworkDisplayFields.keys),
            tx.pure(artworkDisplayFields.values),
        ],
        typeArguments: [ARTWORK_TYPE],
    });
    tx.moveCall({
        target: "0x2::display::update_version",
        arguments: [artworkDisplay],
        typeArguments: [ARTWORK_TYPE],
    });
    tx.transferObjects([artworkDisplay], tx.pure(address));
    await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true,
        },
    });
}
createArtworkDisplay();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29ya19kaXNwbGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FydHdvcmtfZGlzcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFdEMsbUVBQW1FO0FBQ25FLFNBQVMsdUJBQXVCLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxFQUFFLHVCQUF1QixHQUFHLEVBQUU7SUFDeEYsT0FBTztRQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUM7UUFDckUsTUFBTSxFQUFFO1lBQ04sUUFBUTtZQUNSLGVBQWU7WUFDZixZQUFZO1lBQ1osR0FBRyxzQkFBc0IsY0FBYyx1QkFBdUIsRUFBRTtZQUNoRSxnQ0FBZ0M7U0FDakM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVELEtBQUssVUFBVSxvQkFBb0I7SUFDakMsTUFBTSxvQkFBb0IsR0FBRyx1QkFBdUIsRUFBRSxDQUFDO0lBRXZELE1BQU0sRUFBRSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztJQUNsQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUVwRCxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sRUFBRSwrQkFBK0I7UUFDdkMsU0FBUyxFQUFFO1lBQ1QsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7WUFDbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7U0FDckM7UUFDRCxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUM7S0FDOUIsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSw4QkFBOEI7UUFDdEMsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDO1FBQzNCLGFBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQztLQUM5QixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQzFDLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUU7WUFDUCxXQUFXLEVBQUUsSUFBSTtTQUNsQjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxvQkFBb0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBBUlRXT1JLX1RZUEUsIFBVQkxJU0hFUl9JRCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgQURNSU5fUEhSQVNFIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbi8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHlvdSBjYW4gdXBkYXRlIHRvIGNoYW5nZSB0aGUgZGlzcGxheSBmaWVsZHNcbmZ1bmN0aW9uIGdldEFydHdvcmtEaXNwbGF5RmllbGRzKGltYWdlUHJvdmlkZXJVcmxQcmVmaXggPSBcIlwiLCBpbWFnZVByb3ZpZGVyVXJsUG9zdGZpeCA9IFwiXCIpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXlzOiBbXCJuYW1lXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJjdXJyZW5jeVwiLCBcImltYWdlX3VybFwiLCBcInByb2plY3RfdXJsXCJdLFxuICAgIHZhbHVlczogW1xuICAgICAgXCJ7bmFtZX1cIixcbiAgICAgIFwie2Rlc2NyaXB0aW9ufVwiLFxuICAgICAgXCJ7Y3VycmVuY3l9XCIsXG4gICAgICBgJHtpbWFnZVByb3ZpZGVyVXJsUHJlZml4fXtpbWFnZV91cmx9JHtpbWFnZVByb3ZpZGVyVXJsUG9zdGZpeH1gLFxuICAgICAgXCJodHRwczovL3d3dy5vcGVuYXJ0bWFya2V0LmNvbS9cIixcbiAgICBdLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVBcnR3b3JrRGlzcGxheSgpIHtcbiAgY29uc3QgYXJ0d29ya0Rpc3BsYXlGaWVsZHMgPSBnZXRBcnR3b3JrRGlzcGxheUZpZWxkcygpO1xuXG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcbiAgY29uc3QgeyBzaWduZXIsIGFkZHJlc3MgfSA9IGdldFNpZ25lcihBRE1JTl9QSFJBU0UpO1xuXG4gIGNvbnN0IGFydHdvcmtEaXNwbGF5ID0gdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogXCIweDI6OmRpc3BsYXk6Om5ld193aXRoX2ZpZWxkc1wiLFxuICAgIGFyZ3VtZW50czogW1xuICAgICAgdHgub2JqZWN0KFBVQkxJU0hFUl9JRCksXG4gICAgICB0eC5wdXJlKGFydHdvcmtEaXNwbGF5RmllbGRzLmtleXMpLFxuICAgICAgdHgucHVyZShhcnR3b3JrRGlzcGxheUZpZWxkcy52YWx1ZXMpLFxuICAgIF0sXG4gICAgdHlwZUFyZ3VtZW50czogW0FSVFdPUktfVFlQRV0sXG4gIH0pO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IFwiMHgyOjpkaXNwbGF5Ojp1cGRhdGVfdmVyc2lvblwiLFxuICAgIGFyZ3VtZW50czogW2FydHdvcmtEaXNwbGF5XSxcbiAgICB0eXBlQXJndW1lbnRzOiBbQVJUV09SS19UWVBFXSxcbiAgfSk7XG5cbiAgdHgudHJhbnNmZXJPYmplY3RzKFthcnR3b3JrRGlzcGxheV0sIHR4LnB1cmUoYWRkcmVzcykpO1xuICBhd2FpdCBzaWduZXIuc2lnbkFuZEV4ZWN1dGVUcmFuc2FjdGlvbkJsb2NrKHtcbiAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICBvcHRpb25zOiB7XG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbn1cblxuY3JlYXRlQXJ0d29ya0Rpc3BsYXkoKTtcbiJdfQ==