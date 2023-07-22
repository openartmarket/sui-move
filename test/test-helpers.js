import { JsonRpcProvider, localnetConnection } from "@mysten/sui.js";
const provider = new JsonRpcProvider(localnetConnection);
export async function getObject(objectId) {
    return await provider.getObject({
        id: objectId,
        options: { showContent: true },
    });
}
export async function getOwnedObjects(address) {
    return await provider.getOwnedObjects({
        owner: address,
    });
}
//# sourceMappingURL=test-helpers.js.map