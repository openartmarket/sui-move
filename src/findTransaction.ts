import type {
	QueryTransactionBlocksParams,
	SuiJsonRpcClient,
	SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";

export async function findTransaction(
	client: SuiJsonRpcClient,
	params: QueryTransactionBlocksParams,
	predicate: (tx: SuiTransactionBlockResponse) => boolean,
) {
	let cursor;
	do {
		const result = await client.queryTransactionBlocks({
			...params,
			cursor,
			order: "descending",
		});
		const found = result.data.find(predicate);
		if (found) {
			return found;
		}
		cursor = result.hasNextPage ? result.nextCursor : null;
	} while (cursor);
	return null;
}
