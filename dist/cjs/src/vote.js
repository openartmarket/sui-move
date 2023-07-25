"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vote = void 0;
const sui_js_1 = require("@mysten/sui.js");
const config_1 = require("./config");
const helpers_1 = require("./helpers");
async function vote({ artwork, voteRequest, voterAccount, choice }) {
    const { signer } = (0, helpers_1.getSigner)(voterAccount);
    const tx = new sui_js_1.TransactionBlock();
    tx.moveCall({
        target: `${config_1.PACKAGE_ID}::dao::vote`,
        arguments: [tx.object(artwork), tx.object(voteRequest), tx.pure(choice)],
    });
    try {
        const txRes = await signer.signAndExecuteTransactionBlock({
            transactionBlock: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showEffects: true,
            },
        });
        return (0, sui_js_1.getExecutionStatus)(txRes);
    }
    catch (e) {
        // console.error("Could not vote", e);
        throw new Error("Could not vote");
    }
}
exports.vote = vote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy92b3RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFzRTtBQUV0RSxxQ0FBc0M7QUFDdEMsdUNBQXNDO0FBUS9CLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQWM7SUFDbkYsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLG1CQUFVLGFBQWE7UUFDbEMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekUsQ0FBQyxDQUFDO0lBRUgsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1lBQ3hELGdCQUFnQixFQUFFLEVBQUU7WUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxPQUFPLEVBQUU7Z0JBQ1AsV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLElBQUEsMkJBQWtCLEVBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLHNDQUFzQztRQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDbkM7QUFDSCxDQUFDO0FBdkJELG9CQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEV4ZWN1dGlvblN0YXR1cywgVHJhbnNhY3Rpb25CbG9jayB9IGZyb20gXCJAbXlzdGVuL3N1aS5qc1wiO1xuXG5pbXBvcnQgeyBQQUNLQUdFX0lEIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgeyBnZXRTaWduZXIgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG50eXBlIFZvdGVQYXJhbXMgPSB7IFxuICBhcnR3b3JrOiBzdHJpbmc7IFxuICB2b3RlUmVxdWVzdDogc3RyaW5nOyBcbiAgdm90ZXJBY2NvdW50OiBzdHJpbmc7IFxuICBjaG9pY2U6IGJvb2xlYW47IFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdm90ZSh7IGFydHdvcmssIHZvdGVSZXF1ZXN0LCB2b3RlckFjY291bnQsIGNob2ljZSB9OiBWb3RlUGFyYW1zKSB7XG4gIGNvbnN0IHsgc2lnbmVyIH0gPSBnZXRTaWduZXIodm90ZXJBY2NvdW50KTtcbiAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb25CbG9jaygpO1xuXG4gIHR4Lm1vdmVDYWxsKHtcbiAgICB0YXJnZXQ6IGAke1BBQ0tBR0VfSUR9OjpkYW86OnZvdGVgLFxuICAgIGFyZ3VtZW50czogW3R4Lm9iamVjdChhcnR3b3JrKSwgdHgub2JqZWN0KHZvdGVSZXF1ZXN0KSwgdHgucHVyZShjaG9pY2UpXSxcbiAgfSk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB0eFJlcyA9IGF3YWl0IHNpZ25lci5zaWduQW5kRXhlY3V0ZVRyYW5zYWN0aW9uQmxvY2soe1xuICAgICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgICByZXF1ZXN0VHlwZTogXCJXYWl0Rm9yTG9jYWxFeGVjdXRpb25cIixcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgc2hvd0VmZmVjdHM6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldEV4ZWN1dGlvblN0YXR1cyh0eFJlcyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IHZvdGVcIiwgZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IHZvdGVcIik7XG4gIH1cbn1cbiJdfQ==