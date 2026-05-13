import type { SuiJsonRpcClient, SuiObjectData } from "@mysten/sui/jsonRpc";

import {
	getObjectData,
	getParsedData,
	getStringField,
	getType,
} from "./getters.js";

export type GetSharesParams = {
	suiClient: SuiJsonRpcClient;
	owner: string;
	assetId: string;
	packageId: string;
	cursor?: string;
};

/**
 * Returns all Share NFTs of an asset owned by an address.
 */
export async function getShares(
	params: GetSharesParams,
): Promise<readonly SuiObjectData[]> {
	const { suiClient, owner, assetId, packageId, cursor } = params;
	const response = await suiClient.getOwnedObjects({
		owner,
		options: {
			showContent: true,
		},
		cursor,
	});
	const data = response.data.map(getObjectData).filter((object) => {
		const parsedData = getParsedData(object);
		const type = `${packageId}::asset::Share`;
		return (
			getType(parsedData) === type &&
			getStringField(parsedData, "asset_id") === assetId
		);
	});
	if (response.hasNextPage && response.nextCursor) {
		const nextData = await getShares({
			...params,
			cursor: response.nextCursor,
		});
		return [...data, ...nextData];
	}

	return data;
}
