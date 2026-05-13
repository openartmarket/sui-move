import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import { findTransaction } from "./findTransaction.js";
import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type MintAssetParams = {
	adminCapId: string;
	kind: string;
	totalShareCount: number;
	sharePrice: number;
	outgoingPrice: number;
	name: string;
	description: string;
	currency: string;
	reference: string;
	metadata?: Record<string, string>;
};

export type MintAssetResult = {
	assetId: string;
	digest: string;
};

/**
 * Mint a new asset.
 *
 * This function is idempotent. If an asset with the same parameters already
 * exists on the chain, it will be returned.
 */
export async function mintAsset(
	wallet: Wallet,
	params: MintAssetParams,
): Promise<MintAssetResult> {
	const {
		adminCapId,
		kind,
		totalShareCount,
		sharePrice,
		outgoingPrice,
		name,
		description,
		currency,
		reference,
		metadata,
	} = params;

	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::asset::mint_asset`,
			arguments: [
				txb.object(adminCapId),
				txb.pure.string(kind),
				txb.pure.u64(totalShareCount),
				txb.pure.u64(sharePrice),
				txb.pure.u64(outgoingPrice),
				txb.pure.string(name),
				txb.pure.string(description),
				txb.pure.string(currency),
				txb.pure.string(reference),
			],
		});
	});

	const { digest } = response;
	const objects = getCreatedObjects(response);
	if (objects.length !== 1)
		throw new Error(`Expected 1 asset, got ${JSON.stringify(objects)}`);
	const assetId = objects[0].objectId;

	if (metadata) {
		const entries = Object.entries(metadata);
		if (entries.length > 0) {
			await wallet.execute(async (txb, packageId) => {
				for (const [key, value] of entries) {
					txb.moveCall({
						target: `${packageId}::asset::set_metadata`,
						arguments: [
							txb.object(adminCapId),
							txb.object(assetId),
							txb.pure.string(key),
							txb.pure.string(value),
						],
					});
				}
			});
		}
	}

	return { assetId, digest };
}

export async function findAsset(
	wallet: Wallet,
	params: MintAssetParams,
): Promise<MintAssetResult | null> {
	const response = await findTransaction(
		wallet.suiClient,
		{
			filter: {
				MoveFunction: {
					function: "mint_asset",
					module: "asset",
					package: wallet.packageId,
				},
			},
			options: {
				showInput: true,
				showObjectChanges: true,
			},
		},
		(res: SuiTransactionBlockResponse) => {
			const {
				adminCapId,
				kind,
				totalShareCount,
				sharePrice,
				outgoingPrice,
				name,
				description,
				currency,
				reference,
			} = params;

			const expected = [
				adminCapId,
				kind,
				totalShareCount,
				sharePrice,
				outgoingPrice,
				name,
				description,
				currency,
				reference,
			].map((value) => value.toString());
			if (
				res.transaction?.data?.transaction?.kind !== "ProgrammableTransaction"
			) {
				return false;
			}
			const inputs = res.transaction.data.transaction.inputs;
			const inputValues = inputs.map((input) => {
				if (input.type === "pure") {
					return input.value;
				}
				if (input.type === "object") {
					return input.objectId;
				}
				return undefined;
			});
			return inputValues.every((value, index) => value === expected[index]);
		},
	);
	if (!response) {
		return null;
	}
	const { digest } = response;
	const objects = getCreatedObjects(response);
	if (objects.length !== 1)
		throw new Error(`Expected 1 asset, got ${JSON.stringify(objects)}`);
	const assetId = objects[0].objectId;
	return { assetId, digest };
}
