import type {
  QueryTransactionBlocksParams,
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

export async function findTransaction(
  client: SuiClient,
  params: QueryTransactionBlocksParams,
  predicate: (tx: SuiTransactionBlockResponse) => boolean,
) {
  let cursor = undefined;
  do {
    const result = await client.queryTransactionBlocks({ ...params, cursor });
    const found = result.data.find(predicate);
    if (found) {
      return found;
    }
    cursor = result.hasNextPage ? result.nextCursor : null;
  } while (cursor !== null);
  return null;
}
