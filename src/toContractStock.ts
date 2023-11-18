import type { MoveStruct, MoveValue, SuiObjectResponse } from "@mysten/sui.js/dist/cjs/client";

export type ContractStock = {
  contractStockId: string;
  digest: string;
  contractId: string;
  quantity: number;
  productId: string;
};

export function toContractStock(response: SuiObjectResponse): ContractStock {
  if (response.error) {
    throw new Error(`ObjectResponseError: ${JSON.stringify(response)}`);
  }
  if (!response.data) {
    throw new Error(`No response.data: ${JSON.stringify(response)}`);
  }
  if (!response.data.content) {
    throw new Error(`No response.data.content: ${JSON.stringify(response)}`);
  }
  if (response.data.content.dataType !== "moveObject") {
    throw new Error(`Unexpected response.data.content.dataType: ${JSON.stringify(response)}`);
  }
  const { fields } = response.data.content;

  function getValue<T extends MoveValue>(
    struct: MoveStruct,
    key: string,
    type: "string" | "number",
  ): T {
    if (Array.isArray(struct)) {
      throw new Error(
        `Unexpected response.data.content.fields as array: ${JSON.stringify(response)}`,
      );
    }
    if (key in struct) {
      const value = Reflect.get(struct, key);
      if (typeof value === type) {
        return value as T;
      }
      throw new Error(
        `Unexpected type for response.data.content.fields[${key}]: ${JSON.stringify(response)}`,
      );
    }
    throw new Error(`No response.data.content.fields[${key}]: ${JSON.stringify(response)}`);
  }

  return {
    contractStockId: response.data.objectId,
    digest: response.data.digest,
    contractId: getValue<string>(fields, "contract_id", "string"),
    quantity: toInt(getValue<string>(fields, "shares", "string")),
    productId: getValue<string>(fields, "reference", "string"),
  };
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
