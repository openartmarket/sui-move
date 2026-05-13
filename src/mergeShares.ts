import type { Digest, ShareId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

export type MergeSharesParam = {
	toShareId: ShareId;
	fromShareId: ShareId;
};

export type MergeSharesResult = {
	digest: Digest;
};

export async function mergeShares(
	wallet: Wallet,
	params: readonly MergeSharesParam[],
): Promise<MergeSharesResult> {
	const response = await wallet.execute(async (txb, packageId) => {
		for (const { toShareId, fromShareId } of params) {
			txb.moveCall({
				target: `${packageId}::asset::merge_shares`,
				arguments: [txb.object(toShareId), txb.object(fromShareId)],
			});
		}
	});

	return { digest: toDigest(response.digest) };
}
