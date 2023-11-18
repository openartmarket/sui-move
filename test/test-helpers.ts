import type { PaginatedObjectsResponse, SuiObjectResponse } from "@mysten/sui.js/client";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import type { MintContractParams, NetworkName } from "../src/types";

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

export const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
export const PACKAGE_ID = getEnv("PACKAGE_ID");
export const CONTRACT_TYPE = `${PACKAGE_ID}::open_art_market::Contract`;
export const CONTRACT_STOCK_TYPE = `${PACKAGE_ID}::open_art_market::ContractStock`;

export function getClient(): SuiClient {
  const url = getFullnodeUrl(SUI_NETWORK);
  return new SuiClient({ url });
}

export async function getObject(objectId: string): Promise<SuiObjectResponse> {
  return await getClient().getObject({
    id: objectId,
    options: { showContent: true },
  });
}

export async function getOwnedObjects(address: string): Promise<PaginatedObjectsResponse> {
  return await getClient().getOwnedObjects({
    owner: address,
  });
}

export function getProvider(SUI_NETWORK: NetworkName) {
  return new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value && name.match(/^USER/)) return "";
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
export const provider = getProvider(SUI_NETWORK as NetworkName);

export const baseOptions = {
  signerPhrase: ADMIN_PHRASE,
  packageId: PACKAGE_ID,
  adminCapId: ADMIN_CAP_ID,
};

export const mintContractOptions: MintContractParams = {
  ...baseOptions,
  totalShareCount: 500,
  sharePrice: 10,
  outgoingPrice: 100,
  creationTimestampMillis: 1685548680595,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  description: "Choconta painting",
  currency: "USD",
  image: "reference-id-for-contract",
};
