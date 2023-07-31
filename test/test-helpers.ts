import {
  Connection,
  JsonRpcProvider,
  PaginatedObjectsResponse,
  SuiObjectResponse,
} from "@mysten/sui.js";

import { MintContractParams } from "../src/types";

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

export const SUI_NETWORK = getEnv("SUI_NETWORK");
export const PACKAGE_ID = getEnv("PACKAGE_ID");
export const CONTRACT_TYPE = `${PACKAGE_ID}::open_art_market::Contract`;
export const CONTRACT_STOCK_TYPE = `${PACKAGE_ID}::open_art_market::ContractStock`;

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

export function getProvider(SUI_NETWORK: string) {
  const connOptions = new Connection({
    fullnode: SUI_NETWORK,
  });
  return new JsonRpcProvider(connOptions);
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
export const provider = getProvider(SUI_NETWORK);

export const mintContractOptions: MintContractParams = {
  signerPhrase: ADMIN_PHRASE,
  packageId: PACKAGE_ID,
  adminCapId: ADMIN_CAP_ID,
  provider,
  totalSupply: 500,
  sharePrice: 10,
  multiplier: 100,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  creationDate: "1685548680595",
  description: "Choconta painting",
  currency: "USD",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
};
