import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import type { AdminCapId, AssetId, AssetKind, Digest } from "./brands.js";
import { toAssetId, toDigest } from "./brands.js";
import { findTransaction } from "./findTransaction.js";
import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

/**
 * Parameters for minting a new Asset.
 *
 * `imageUrl`, `thumbnailUrl`, `link`, and `creator` are surfaced on-chain
 * via the Sui Object Display Standard so that wallets and explorers
 * render the asset consistently.
 *
 * @see https://docs.sui.io/standards/display
 */
export type MintAssetParams = {
	adminCapId: AdminCapId;
	kind: AssetKind;
	totalShareCount: number;
	sharePrice: number;
	outgoingPrice: number;
	name: string;
	description: string;
	currency: string;
	/**
	 * Full URL to the canonical image for this asset.
	 *
	 * Surfaced as the Sui Display `image_url` field.
	 * @see https://docs.sui.io/standards/display
	 */
	imageUrl: string;
	/**
	 * Full URL to a smaller preview image suitable for wallets and listings.
	 *
	 * Surfaced as the Sui Display `thumbnail_url` field.
	 * @see https://docs.sui.io/standards/display
	 */
	thumbnailUrl: string;
	/**
	 * Full URL to the per-asset info / detail page in the consuming
	 * application — what wallets and explorers link to when a user clicks
	 * through the asset.
	 *
	 * Surfaced as the Sui Display `link` field.
	 * @see https://docs.sui.io/standards/display
	 */
	link: string;
	/**
	 * Human-readable creator / author name (e.g. the artist for an artwork).
	 *
	 * Surfaced as the Sui Display `creator` field.
	 * @see https://docs.sui.io/standards/display
	 */
	creator: string;
	metadata?: Record<string, string>;
};

export type MintAssetResult = {
	assetId: AssetId;
	digest: Digest;
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
		imageUrl,
		thumbnailUrl,
		link,
		creator,
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
				txb.pure.string(imageUrl),
				txb.pure.string(thumbnailUrl),
				txb.pure.string(link),
				txb.pure.string(creator),
			],
		});
	});

	const digest = toDigest(response.digest);
	const objects = getCreatedObjects(response);
	if (objects.length !== 1)
		throw new Error(`Expected 1 asset, got ${JSON.stringify(objects)}`);
	const assetId = toAssetId(objects[0].objectId);

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
				imageUrl,
				thumbnailUrl,
				link,
				creator,
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
				imageUrl,
				thumbnailUrl,
				link,
				creator,
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
	const digest = toDigest(response.digest);
	const objects = getCreatedObjects(response);
	if (objects.length !== 1)
		throw new Error(`Expected 1 asset, got ${JSON.stringify(objects)}`);
	const assetId = toAssetId(objects[0].objectId);
	return { assetId, digest };
}
