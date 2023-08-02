import { getClient } from "./helpers";
import { AvailableStockParams } from "./types";
/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
export async function availableStock({
  contractId,
  network,
}: AvailableStockParams): Promise<number> {
  const client = getClient(network);

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
