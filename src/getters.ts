import type {
  MoveStruct,
  SuiClient,
  SuiObjectChangeCreated,
  SuiObjectData,
  SuiObjectResponse,
  SuiParsedData,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

import type { ReadonlyWallet } from "./Wallet.js";

export function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[] {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created",
  ) as SuiObjectChangeCreated[];
}

export function getObjectData(response: SuiObjectResponse): SuiObjectData {
  const { error, data } = response;
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error(`No data: ${JSON.stringify(response)}`);
  }
  return data;
}

export function getParsedData(data: SuiObjectData): SuiParsedData {
  const { content } = data;
  if (!content) {
    throw new Error(`No content: ${JSON.stringify(data)}`);
  }
  return content;
}

export function getType(data: SuiParsedData): string {
  return getMoveObject(data).type;
}

export function getStringField(data: SuiParsedData, key: string): string {
  const { fields } = getMoveObject(data);
  if (!fields) {
    throw new Error(`No txn.data.content.fields: ${JSON.stringify(data)}`);
  }

  function getStringField(struct: MoveStruct, key: string): string {
    if (Array.isArray(struct)) {
      throw new Error(`Unexpected response.data.content.fields as array: ${JSON.stringify(data)}`);
    }
    if (!(key in struct)) {
      throw new Error(`No response.data.content.fields[${key}]: ${JSON.stringify(data)}`);
    }
    const value = Reflect.get(struct, key);
    if (typeof value !== "string") {
      throw new Error(
        `Unexpected type for response.data.content.fields[${key}]: ${JSON.stringify(data)}`,
      );
    }
    return value;
  }

  return getStringField(fields, key);
}

/**
 * Get the quantity of a contract or a contract stock.
 */
export async function getQuantity(suiClient: SuiClient, id: string): Promise<number> {
  const response = await suiClient.getObject({
    id,
    options: { showContent: true, showOwner: true },
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}

/**
 * Get the quantity of a contract or a contract stock.
 */
export async function getWalletQuantity(wallet: ReadonlyWallet, id: string): Promise<number> {
  const { suiClient } = wallet;
  const response = await suiClient.getObject({
    id,
    options: { showContent: true, showOwner: true },
  });
  const objectData = getObjectData(response);
  const addressOwner = getAddressOwner(objectData);
  if (addressOwner !== wallet.address) {
    throw new Error(
      `Object ${objectData} is not owned by ${wallet.address} but by ${addressOwner}`,
    );
  }

  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}

export function getAddressOwner(objectData: SuiObjectData): string | null {
  const owner = objectData.owner;
  if (!owner) throw new Error(`Object ${objectData} has no owner`);
  if (typeof owner === "string") {
    throw new Error(`Object ${objectData} has a string owner ${owner}`);
  }
  if ("AddressOwner" in owner) {
    return owner.AddressOwner;
  }
  return null;
}

function getMoveObject(data: SuiParsedData) {
  const { dataType } = data;
  if (dataType !== "moveObject") {
    throw new Error(`Unexpected txn.data.content.dataType: ${JSON.stringify(data)}`);
  }
  return data;
}

export function getIntField(data: SuiParsedData, key: string): number {
  const value = getStringField(data, key);
  return toInt(value);
}

function toInt(s: string) {
  if (!s.match(/^[0-9]+$/)) {
    throw new Error(`${s} is not a valid integer`);
  }
  const number = parseInt(s, 10);
  if (isNaN(number) || !Number.isInteger(number)) {
    throw new Error(`${s} is not a valid integer`);
  }
  return number;
}
