import type { SuiObjectData } from "@mysten/sui/jsonRpc";

import type { AssetId, Digest, ShareId } from "./brands.js";
import { toAssetId, toDigest, toShareId } from "./brands.js";
import { getIntField, getParsedData, getStringField } from "./getters.js";

export type Share = {
	shareId: ShareId;
	digest: Digest;
	assetId: AssetId;
	amount: number;
	reference: string;
};

export function toShare(objectData: SuiObjectData): Share {
	const parsedData = getParsedData(objectData);

	return {
		shareId: toShareId(objectData.objectId),
		digest: toDigest(objectData.digest),
		assetId: toAssetId(getStringField(parsedData, "asset_id")),
		amount: getIntField(parsedData, "amount"),
		reference: getStringField(parsedData, "reference"),
	};
}
