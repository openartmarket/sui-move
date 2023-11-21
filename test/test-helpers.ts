import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import type { MintContractParams } from "../src";
import { getIntField, getObjectData, getParsedData } from "../src/getters.js";
import type { NetworkName } from "../src/types";

export const PUBLISHER_ID = getEnv("PUBLISHER_ID");
export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

export const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
export const PACKAGE_ID = getEnv("PACKAGE_ID");

export function getClient(): SuiClient {
  const url = getFullnodeUrl(SUI_NETWORK);
  return new SuiClient({ url });
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}

export const mintContractOptions: MintContractParams = {
  adminCapId: ADMIN_CAP_ID,
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

/**
 * Get the quantity of a contract or a contract stock.
 */
export async function getQuantity(client: SuiClient, id: string): Promise<number> {
  const response = await client.getObject({
    id,
    options: { showContent: true },
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}
