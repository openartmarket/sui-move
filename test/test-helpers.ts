import { exec } from "node:child_process";

import type { SuiObjectResponse } from "@mysten/sui.js/client";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import type { MintContractParams } from "../src";
import { getIntField, getObjectData, getParsedData } from "../src/getters.js";
import type { NetworkName } from "../src/types";

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

export function getClient(): SuiClient {
  const url = getFullnodeUrl(SUI_NETWORK);
  return new SuiClient({ url });
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value && name.match(/^USER/)) return "";
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}

export async function getOwnedObject(
  client: SuiClient,
  owner: string,
  objectId: string,
): Promise<SuiObjectResponse> {
  const ownedObjects = await client.getOwnedObjects({
    owner,
  });
  if (ownedObjects.hasNextPage) {
    throw new Error(`Owned objects of ${owner} has more than one page`);
  }

  const found = ownedObjects.data.find((response) => getObjectData(response).objectId === objectId);
  if (!found) {
    throw new Error(
      `Object ${objectId} not found in owned objects of ${owner}: ${JSON.stringify(
        ownedObjects.data,
      )}`,
    );
  }
  return found;
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

export type SuiAddress = {
  readonly address: string;
  readonly phrase: string;
};

export async function getSuiCoinObjectId(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec("sui client gas --json", (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));
      const [
        {
          id: { id },
        },
      ] = JSON.parse(stdout);
      resolve(id);
    });
  });
}

export async function newAddress(): Promise<SuiAddress> {
  return new Promise((resolve, reject) => {
    exec("sui client new-address ed25519 --json", (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));
      const [address, phrase] = JSON.parse(stdout);
      resolve({ address, phrase });
    });
  });
}

export type TransferSuiParams = {
  to: string;
  suiCoinObjectId: string;
  amount?: number;
  gasBudget?: number;
};

export async function transferSui({
  to,
  suiCoinObjectId,
  amount = 20_000_000,
  gasBudget = 200_000_000,
}: TransferSuiParams) {
  exec(
    `sui client transfer-sui --amount ${amount} --to "${to}" --gas-budget ${gasBudget} --sui-coin-object-id "${suiCoinObjectId}"`,
  );
}
