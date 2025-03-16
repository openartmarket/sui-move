import type { SuiClient, SuiObjectData } from "@mysten/sui/client";

import { getObjectData, getParsedData, getStringField, getType } from "./getters.js";

export type GetContractStocksParams = {
  suiClient: SuiClient;
  owner: string;
  contractId: string;
  packageId: string;
  cursor?: string;
};

/**
 * Returns all contract stocks of a contract owned by an address.
 */
export async function getContractStocks(
  params: GetContractStocksParams,
): Promise<readonly SuiObjectData[]> {
  const { suiClient, owner, contractId, packageId, cursor } = params;
  const type = `${packageId}::open_art_market::ContractStock`;
  const response = await suiClient.getOwnedObjects({
    owner,
    options: {
      showContent: true,
    },
    cursor,
  });
  const data = response.data.map(getObjectData).filter((object) => {
    const parsedData = getParsedData(object);
    return getType(parsedData) === type && getStringField(parsedData, "contract_id") === contractId;
  });
  if (response.hasNextPage && response.nextCursor) {
    const nextData = await getContractStocks({
      ...params,
      cursor: response.nextCursor,
    });
    return [...data, ...nextData];
  }

  return data;
}
