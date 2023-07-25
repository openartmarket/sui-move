"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vote = void 0;
const sui_js_1 = require("@mysten/sui.js");
const config_1 = require("./config");
const helpers_1 = require("./helpers");
async function vote({ artworkId, voteRequest, voterAccount, choice }) {
    const { signer } = (0, helpers_1.getSigner)(voterAccount);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${config_1.PACKAGE_ID}::dao::vote`,
        arguments: [tx.object(artworkId), tx.object(voteRequest), tx.pure(choice)],
    });
    const txRes = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        requestType: "WaitForLocalExecution",
        options: {
            showEffects: true,
        },
    });
    (0, helpers_1.handleTransactionResponse)(txRes);
    return (0, sui_js_1.getExecutionStatus)(txRes);
}
exports.vote = vote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92b3RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFzRTtBQUV0RSxxQ0FBc0M7QUFDdEMsdUNBQWlFO0FBRzFELEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQWM7SUFDckYsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLG1CQUFVLGFBQWE7UUFDbEMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0UsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7UUFDeEQsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLE9BQU8sRUFBRTtZQUNQLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBQSxtQ0FBeUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxPQUFPLElBQUEsMkJBQWtCLEVBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQWpCRCxvQkFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRFeGVjdXRpb25TdGF0dXMsIFRyYW5zYWN0aW9uQmxvY2sgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuaW1wb3J0IHsgUEFDS0FHRV9JRCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IHsgZ2V0U2lnbmVyLCBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHsgVm90ZVBhcmFtcyB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2b3RlKHsgYXJ0d29ya0lkLCB2b3RlUmVxdWVzdCwgdm90ZXJBY2NvdW50LCBjaG9pY2UgfTogVm90ZVBhcmFtcykge1xuICBjb25zdCB7IHNpZ25lciB9ID0gZ2V0U2lnbmVyKHZvdGVyQWNjb3VudCk7XG4gIGNvbnN0IHR4ID0gbmV3IFRyYW5zYWN0aW9uQmxvY2soKTtcblxuICB0eC5tb3ZlQ2FsbCh7XG4gICAgdGFyZ2V0OiBgJHtQQUNLQUdFX0lEfTo6ZGFvOjp2b3RlYCxcbiAgICBhcmd1bWVudHM6IFt0eC5vYmplY3QoYXJ0d29ya0lkKSwgdHgub2JqZWN0KHZvdGVSZXF1ZXN0KSwgdHgucHVyZShjaG9pY2UpXSxcbiAgfSk7XG4gIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2hvd0VmZmVjdHM6IHRydWUsXG4gICAgfSxcbiAgfSk7XG4gIGhhbmRsZVRyYW5zYWN0aW9uUmVzcG9uc2UodHhSZXMpO1xuICByZXR1cm4gZ2V0RXhlY3V0aW9uU3RhdHVzKHR4UmVzKTtcbn1cbiJdfQ==