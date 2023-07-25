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
    const { adminCapId, packageId, signerPhrase, totalSupply, sharePrice, multiplier, name, artist, creationDate, description, currency, image } = params;
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
    const artworkId = (0, sui_js_1.getCreatedObjects)(txRes)?.[0].reference.objectId;
    if (!artworkId)
        throw new Error("Could not mint artwork");
    return artworkId;
}
exports.mintArtwork = mintArtwork;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcnR3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFxRTtBQUVyRSx1Q0FBc0M7QUFtQnRDOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsV0FBVyxDQUFDLE1BQXlCO0lBQ3pELE1BQU0sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUN6SSxNQUFNLENBQUM7SUFFVCwyREFBMkQ7SUFFM0QsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsbUJBQVMsRUFBQyxZQUFZLENBQUMsQ0FBQztJQUMzQyxNQUFNLEVBQUUsR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7SUFFbEMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNWLE1BQU0sRUFBRSxHQUFHLFNBQVMsMkNBQTJDO1FBQy9ELFNBQVMsRUFBRTtZQUNULEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2IsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDZixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNyQixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNqQixFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNmO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsOEJBQThCLENBQUM7UUFDeEQsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLE9BQU8sRUFBRTtZQUNQLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsV0FBVyxFQUFFLElBQUk7U0FDbEI7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFBLDBCQUFpQixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNuRSxJQUFJLENBQUMsU0FBUztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUUxRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBdENELGtDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldENyZWF0ZWRPYmplY3RzLCBUcmFuc2FjdGlvbkJsb2NrIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IGdldFNpZ25lciB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZXhwb3J0IHR5cGUgQ3VycmVuY3kgPSBcIlVTRFwiIHwgXCJFVVJcIiB8IFwiR0JQXCIgfCBcIk5PS1wiIDtcblxuZXhwb3J0IHR5cGUgTWludEFydHdvcmtQYXJhbXMgPSB7XG4gIHNpZ25lclBocmFzZTogc3RyaW5nO1xuICBwYWNrYWdlSWQ6IHN0cmluZztcbiAgYWRtaW5DYXBJZDogc3RyaW5nO1xuICB0b3RhbFN1cHBseTogbnVtYmVyO1xuICBzaGFyZVByaWNlOiBudW1iZXI7XG4gIG11bHRpcGxpZXI6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xuICBhcnRpc3Q6IHN0cmluZztcbiAgY3JlYXRpb25EYXRlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGN1cnJlbmN5OiBDdXJyZW5jeTtcbiAgaW1hZ2U6IHN0cmluZztcbn07XG5cbi8qKlxuICogTWludHMgYSBuZXcgYXJ0d29ya1xuICogQHBhcmFtIHBhcmFtc1xuICogQHJldHVybnMgdGhlIGFydHdvcmsgaWRcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pbnRBcnR3b3JrKHBhcmFtczogTWludEFydHdvcmtQYXJhbXMpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCB7YWRtaW5DYXBJZCwgcGFja2FnZUlkLCBzaWduZXJQaHJhc2UsIHRvdGFsU3VwcGx5LCBzaGFyZVByaWNlLCBtdWx0aXBsaWVyLCBuYW1lLCBhcnRpc3QsIGNyZWF0aW9uRGF0ZSwgZGVzY3JpcHRpb24sIGN1cnJlbmN5LCBpbWFnZSB9ID1cbiAgICBwYXJhbXM7XG5cbiAgLy8gY29uc29sZS5sb2coXCJNaW50IGFydHdvcms6ICVzXCIsIG5hbWUgKyBcIiBieSBcIiArIGFydGlzdCk7XG5cbiAgY29uc3QgeyBzaWduZXIgfSA9IGdldFNpZ25lcihzaWduZXJQaHJhc2UpO1xuICBjb25zdCB0eCA9IG5ldyBUcmFuc2FjdGlvbkJsb2NrKCk7XG5cbiAgdHgubW92ZUNhbGwoe1xuICAgIHRhcmdldDogYCR7cGFja2FnZUlkfTo6b3Blbl9hcnRfbWFya2V0OjptaW50X2FydHdvcmtfYW5kX3NoYXJlYCxcbiAgICBhcmd1bWVudHM6IFtcbiAgICAgIHR4Lm9iamVjdChhZG1pbkNhcElkKSxcbiAgICAgIHR4LnB1cmUodG90YWxTdXBwbHkpLFxuICAgICAgdHgucHVyZShzaGFyZVByaWNlKSxcbiAgICAgIHR4LnB1cmUobXVsdGlwbGllciksXG4gICAgICB0eC5wdXJlKG5hbWUpLFxuICAgICAgdHgucHVyZShhcnRpc3QpLFxuICAgICAgdHgucHVyZShjcmVhdGlvbkRhdGUpLFxuICAgICAgdHgucHVyZShkZXNjcmlwdGlvbiksXG4gICAgICB0eC5wdXJlKGN1cnJlbmN5KSxcbiAgICAgIHR4LnB1cmUoaW1hZ2UpLFxuICAgIF0sXG4gIH0pO1xuXG4gIGNvbnN0IHR4UmVzID0gYXdhaXQgc2lnbmVyLnNpZ25BbmRFeGVjdXRlVHJhbnNhY3Rpb25CbG9jayh7XG4gICAgdHJhbnNhY3Rpb25CbG9jazogdHgsXG4gICAgcmVxdWVzdFR5cGU6IFwiV2FpdEZvckxvY2FsRXhlY3V0aW9uXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgc2hvd09iamVjdENoYW5nZXM6IHRydWUsXG4gICAgICBzaG93RWZmZWN0czogdHJ1ZSxcbiAgICB9LFxuICB9KTtcblxuICBjb25zdCBhcnR3b3JrSWQgPSBnZXRDcmVhdGVkT2JqZWN0cyh0eFJlcyk/LlswXS5yZWZlcmVuY2Uub2JqZWN0SWQ7XG4gIGlmICghYXJ0d29ya0lkKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgbWludCBhcnR3b3JrXCIpO1xuXG4gIHJldHVybiBhcnR3b3JrSWQ7XG59XG5cbiJdfQ==