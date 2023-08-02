import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

const client = new SuiClient({
  url: getFullnodeUrl("localnet"),
});
import { AvailableStockParams } from "./types";
/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
export async function availableStock({ contractId }: AvailableStockParams): Promise<number> {
  const txn = await client.getObject({
    id: contractId,
    options: { showContent: true },
  });

  let availableStock = 0;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (txn?.data?.content?.fields?.shares) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    availableStock = +(txn?.data?.content?.fields?.shares || "0");
  }
  return availableStock;
}
