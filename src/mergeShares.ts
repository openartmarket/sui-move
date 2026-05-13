import type { Wallet } from "./Wallet.js";

export type MergeSharesParam = {
	toShareId: string;
	fromShareId: string;
};

export type MergeSharesResult = {
	digest: string;
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

	const { digest } = response;
	return { digest };
}
