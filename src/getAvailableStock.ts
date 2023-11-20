import type { SuiClient } from "@mysten/sui.js/client";

import { getIntField, getObjectData, getParsedData } from "./getters.js";

export async function getAvailableStock(client: SuiClient, contractId: string): Promise<number> {
  const response = await client.getObject({
    id: contractId,
    options: { showContent: true },
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}
