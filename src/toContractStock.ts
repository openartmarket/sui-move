import type { SuiObjectData } from "@mysten/sui.js/client";

import { getIntField, getParsedData, getStringField } from "./getters";

export type ContractStock = {
  contractStockId: string;
  digest: string;
  contractId: string;
  quantity: number;
  productId: string;
};

export function toContractStock(objectData: SuiObjectData): ContractStock {
  const parsedData = getParsedData(objectData);

  return {
    contractStockId: objectData.objectId,
    digest: objectData.digest,
    contractId: getStringField(parsedData, "contract_id"),
    quantity: getIntField(parsedData, "shares"),
    productId: getStringField(parsedData, "reference"),
  };
}
