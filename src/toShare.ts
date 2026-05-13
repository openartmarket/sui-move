import type { SuiObjectData } from "@mysten/sui/jsonRpc";

import { getIntField, getParsedData, getStringField } from "./getters.js";

export type Share = {
	shareId: string;
	digest: string;
	assetId: string;
	amount: number;
	reference: string;
};

export function toShare(objectData: SuiObjectData): Share {
	const parsedData = getParsedData(objectData);

	return {
		shareId: objectData.objectId,
		digest: objectData.digest,
		assetId: getStringField(parsedData, "asset_id"),
		amount: getIntField(parsedData, "amount"),
		reference: getStringField(parsedData, "reference"),
	};
}
