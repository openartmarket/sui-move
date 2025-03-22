import type {
  QueryTransactionBlocksParams,
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/dist/cjs/client";

export async function queryAllTransactions(
  client: SuiClient,
  params: QueryTransactionBlocksParams,
) {
  const data: SuiTransactionBlockResponse[] = [];
  let cursor = undefined;
  do {
    const result = await client.queryTransactionBlocks({ ...params, cursor });
    data.push(...result.data);
    cursor = result.hasNextPage ? result.nextCursor : null;
  } while (cursor !== null);
  return data;
}
