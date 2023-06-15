import { JsonRpcProvider, localnetConnection } from "@mysten/sui.js";
const provider = new JsonRpcProvider(localnetConnection);

export async function getObject(objectId: string) {
  return await provider.getObject({
    id: objectId,
    options: { showContent: true },
  });
}

export async function getOwnedObjects(address: string) {
  return await provider.getOwnedObjects({
    owner: address,
  });
}
