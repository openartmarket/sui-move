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
  return null;
  let cursor = undefined;
  do {
    const result = await client.queryTransactionBlocks({ ...params, cursor });
    const found = result.data.find(predicate);
    if (found) {
      console.log("FOUND AN OLD ONE");
      return found;
    }
    cursor = result.hasNextPage ? result.nextCursor : null;
    console.log("NOT FOUND. Next cursor:", cursor);
  } while (cursor !== null);
  console.log("NOT FOUND AT ALL");
  return null;
}
