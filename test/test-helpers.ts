import {
  JsonRpcProvider,
  localnetConnection,
  PaginatedObjectsResponse,
  SuiObjectResponse,
} from "@mysten/sui.js";

import { getEnv } from "../src/config";
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

export const PUBLISHER_ID = getEnv("PUBLISHER_ID");
export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");
export const USER1_PHRASE = getEnv("USER1_PHRASE");
export const USER2_PHRASE = getEnv("USER2_PHRASE");
export const USER3_PHRASE = getEnv("USER3_PHRASE");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const USER1_ADDRESS = getEnv("USER1_ADDRESS");
export const USER2_ADDRESS = getEnv("USER2_ADDRESS");
export const USER3_ADDRESS = getEnv("USER3_ADDRESS");

