import type { SuiObjectResponse } from "@mysten/sui.js/client";

import { getIntField, getObjectData, getParsedData, getStringField } from "./getters";

export type ContractStock = {
  contractStockId: string;
  digest: string;
  contractId: string;
  quantity: number;
  productId: string;
};

export function toContractStock(response: SuiObjectResponse): ContractStock {
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);

  return {
    contractStockId: objectData.objectId,
    digest: objectData.digest,
    contractId: getStringField(parsedData, "contract_id"),
    quantity: getIntField(parsedData, "shares"),
    productId: getStringField(parsedData, "reference"),
  };
}
