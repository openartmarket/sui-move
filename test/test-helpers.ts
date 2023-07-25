import {
  JsonRpcProvider,
  localnetConnection,
  PaginatedObjectsResponse,
  SuiObjectResponse,
} from "@mysten/sui.js";

const provider: JsonRpcProvider = new JsonRpcProvider(localnetConnection);

export async function getObject(objectId: string): Promise<SuiObjectResponse> {
  return await provider.getObject({
    id: objectId,
    options: { showContent: true },
  });
}

export async function getOwnedObjects(address: string): Promise<PaginatedObjectsResponse> {
  return await provider.getOwnedObjects({
    owner: address,
  });
}

export * from "./test-data";
