import type { Digest, ShareId } from "./brands.js";
import { toDigest, toShareId } from "./brands.js";
import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type SplitShareParams = {
	shareId: ShareId;
	amount: number;
};

export type SplitShareResult = {
	digest: Digest;
	splitShareId: ShareId;
};

export async function splitShare(
	wallet: Wallet,
	params: SplitShareParams,
): Promise<SplitShareResult> {
	const response = await wallet.execute(async (txb, packageId) => {
		const { shareId, amount } = params;
		txb.moveCall({
			target: `${packageId}::asset::split_share`,
			arguments: [txb.object(shareId), txb.pure.u64(amount)],
		});
	});
	const digest = toDigest(response.digest);

	const createdObjects = getCreatedObjects(response);
	if (createdObjects.length !== 1) {
		throw new Error(
			`Expected 1 created object, got ${JSON.stringify(createdObjects)}`,
		);
	}
	const splitShareId = toShareId(createdObjects[0].objectId);

	return { digest, splitShareId };
}
