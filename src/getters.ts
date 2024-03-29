import type {
  MoveStruct,
  SuiObjectChangeCreated,
  SuiObjectData,
  SuiObjectResponse,
  SuiParsedData,
  SuiTransactionBlockResponse,
} from "@mysten/sui.js/client";

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
