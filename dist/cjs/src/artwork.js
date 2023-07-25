"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintArtwork = void 0;
const sui_js_1 = require("@mysten/sui.js");
const helpers_1 = require("./helpers");
/**
 * Mints a new artwork
 * @param params
 * @returns the artwork id
 */
async function mintArtwork(params) {
    const { adminCapId, packageId, signerPhrase, totalSupply, sharePrice, multiplier, name, artist, creationDate, description, currency, image, } = params;
    // console.log("Mint artwork: %s", name + " by " + artist);
    const { signer } = (0, helpers_1.getSigner)(signerPhrase);
    const tx = new sui_js_1.TransactionBlock();
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
    (0, helpers_1.handleTransactionResponse)(txRes);
    const artworkId = (0, sui_js_1.getCreatedObjects)(txRes)?.[0].reference.objectId;
    if (!artworkId)
        throw new Error("Could not mint artwork");
    return artworkId;
}
exports.mintArtwork = mintArtwork;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcnR3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFxRTtBQUVyRSx1Q0FBaUU7QUFFakU7Ozs7R0FJRztBQUNJLEtBQUssVUFBVSxXQUFXLENBQUMsTUFBeUI7SUFDekQsTUFBTSxFQUNKLFVBQVUsRUFDVixTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sWUFBWSxFQUNaLFdBQVcsRUFDWCxRQUFRLEVBQ1IsS0FBSyxHQUNOLEdBQUcsTUFBTSxDQUFDO0lBRVgsMkRBQTJEO0lBRTNELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLG1CQUFTLEVBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0MsTUFBTSxFQUFFLEdBQUcsSUFBSSx5QkFBZ0IsRUFBRSxDQUFDO0lBRWxDLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDVixNQUFNLEVBQUUsR0FBRyxTQUFTLDJDQUEyQztRQUMvRCxTQUFTLEVBQUU7WUFDVCxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNyQixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNiLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2YsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDckIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDakIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDZjtLQUNGLENBQUMsQ0FBQztJQUVILE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLDhCQUE4QixDQUFDO1FBQ3hELGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsV0FBVyxFQUFFLHVCQUF1QjtRQUNwQyxPQUFPLEVBQUU7WUFDUCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBQSxtQ0FBeUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxNQUFNLFNBQVMsR0FBRyxJQUFBLDBCQUFpQixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNuRSxJQUFJLENBQUMsU0FBUztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUUxRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBbkRELGtDQW1EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldENyZWF0ZWRPYmplY3RzLCBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IGdldFNpZ25lciwgaGFuZGxlVHJhbnNhY3Rpb25SZXNwb25zZSB9IGZyb20gXCIuL2hlbHBlcnNcIjtcbmltcG9ydCB7IE1pbnRBcnR3b3JrUGFyYW1zIH0gZnJvbSBcIi4vdHlwZXNcIjtcbi8qKlxuICogTWludHMgYSBuZXcgYXJ0d29ya1xuICogQHBhcmFtIHBhcmFtc1xuICogQHJldHVybnMgdGhlIGFydHdvcmsgaWRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbnRBcnR3b3JrKHBhcmFtczogTWludEFydHdvcmtQYXJhbXMpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCB7XG4gICAgYWRtaW5DYXBJZCxcbiAgICBwYWNrYWdlSWQsXG4gICAgc2lnbmVyUGhyYXNlLFxuICAgIHRvdGFsU3VwcGx5LFxuICAgIHNoYXJlUHJpY2UsXG4gICAgbXVsdGlwbGllcixcbiAgICBuYW1lLFxuICAgIGFydGlzdCxcbiAgICBjcmVhdGlvbkRhdGUsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgY3VycmVuY3ksXG4gICAgaW1hZ2UsXG4gIH0gPSBwYXJhbXM7XG5cbiAgLy8gY29uc29sZS5sb2coXCJNaW50IGFydHdvcms6ICVzXCIsIG5hbWUgKyBcIiBieSBcIiArIGFydGlzdCk7XG5cbiAgY29uc3QgeyBzaWduZXIgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7cGFja2FnZUlkfTo6b3Blbl9hcnRfbWFya2V0OjptaW50X2FydHdvcmtfYW5kX3NoYXJlYCxcbiAgICBhcmd1bWVudHM6IFtcbiAgICAgIHR4Lm9iamVjdChhZG1pbkNhcElkKSxcbiAgICAgIHR4LnB1cmUodG90YWxTdXBwbHkpLFxuICAgICAgdHgucHVyZShzaGFyZVByaWNlKSxcbiAgICAgIHR4LnB1cmUobXVsdGlwbGllciksXG4gICAgICB0eC5wdXJlKG5hbWUpLFxuICAgICAgdHgucHVyZShhcnRpc3QpLFxuICAgICAgdHgucHVyZShjcmVhdGlvbkRhdGUpLFxuICAgICAgdHgucHVyZShkZXNjcmlwdGlvbiksXG4gICAgICB0eC5wdXJlKGN1cnJlbmN5KSxcbiAgICAgIHR4LnB1cmUoaW1hZ2UpLFxuICAgIF0sXG4gIH0pO1xuXG4gIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2hvd09iamVjdENoYW5nZXM6IHRydWUsXG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcblxuICBoYW5kbGVUcmFuc2FjdGlvblJlc3BvbnNlKHR4UmVzKTtcbiAgY29uc3QgYXJ0d29ya0lkID0gZ2V0Q3JlYXRlZE9iamVjdHModHhSZXMpPy5bMF0ucmVmZXJlbmNlLm9iamVjdElkO1xuICBpZiAoIWFydHdvcmtJZCkgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IG1pbnQgYXJ0d29ya1wiKTtcblxuICByZXR1cm4gYXJ0d29ya0lkO1xufVxuIl19