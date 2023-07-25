"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOutgoingPrice = void 0;
const sui_js_1 = require("@mysten/sui.js");
const helpers_1 = require("./helpers");
async function updateOutgoingPrice({ artwork, newOutgoingPrice, packageId, adminCapId }) {
    const { signer } = (0, helpers_1.getSigner)("admin");
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${packageId}::open_art_market::update_outgoing_price`,
        arguments: [tx.object(adminCapId), tx.object(artwork), tx.pure(newOutgoingPrice)],
    });
    try {
        await signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showEffects: true,
            },
        });
    }
    catch (e) {
        console.error("Could not update artwork outgoing price", e);
    }
}
exports.updateOutgoingPrice = updateOutgoingPrice;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlX2FydHdvcmtfb3V0Z29pbmdfcHJpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXBkYXRlX2FydHdvcmtfb3V0Z29pbmdfcHJpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQWtEO0FBRWxELHVDQUFzQztBQVMvQixLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBNkI7SUFDdkgsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMsMENBQTBDO1FBQzlELFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDbEYsQ0FBQyxDQUFDO0lBRUgsSUFBSTtRQUNGLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1lBQzFDLGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxPQUFPLEVBQUU7Z0JBQ1AsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRixDQUFDLENBQUM7S0FHSjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM3RDtBQUNILENBQUM7QUF0QkQsa0RBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5cbnR5cGUgVXBkYXRlT3V0Z29pbmdQcmljZVBhcmFtcyA9IHsgXG4gIGFydHdvcms6IHN0cmluZzsgXG4gIG5ld091dGdvaW5nUHJpY2U6IG51bWJlcjsgXG4gIHBhY2thZ2VJZDogc3RyaW5nO1xuICBhZG1pbkNhcElkOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlT3V0Z29pbmdQcmljZSh7IGFydHdvcmssIG5ld091dGdvaW5nUHJpY2UsIHBhY2thZ2VJZCwgYWRtaW5DYXBJZCB9OiBVcGRhdGVPdXRnb2luZ1ByaWNlUGFyYW1zKSB7XG4gIGNvbnN0IHsgc2lnbmVyIH0gPSBnZXRTaWduZXIoXCJhZG1pblwiKTtcbiAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb25CbG9jaygpO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IGAke3BhY2thZ2VJZH06Om9wZW5fYXJ0X21hcmtldDo6dXBkYXRlX291dGdvaW5nX3ByaWNlYCxcbiAgICBhcmd1bWVudHM6IFt0eC5vYmplY3QoYWRtaW5DYXBJZCksIHR4Lm9iamVjdChhcnR3b3JrKSwgdHgucHVyZShuZXdPdXRnb2luZ1ByaWNlKV0sXG4gIH0pO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgICB0cmFuc2FjdGlvbkJsb2NrOiB0eCxcbiAgICAgIHJlcXVlc3RUeXBlOiBcIldhaXRGb3JMb2NhbEV4ZWN1dGlvblwiLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgdXBkYXRlIGFydHdvcmsgb3V0Z29pbmcgcHJpY2VcIiwgZSk7XG4gIH1cbn1cbiJdfQ==