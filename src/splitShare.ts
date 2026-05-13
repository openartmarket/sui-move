import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type SplitShareParams = {
	shareId: string;
	amount: number;
};

export type SplitShareResult = {
	digest: string;
	splitShareId: string;
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
	const { digest } = response;

	const createdObjects = getCreatedObjects(response);
	if (createdObjects.length !== 1) {
		throw new Error(
			`Expected 1 created object, got ${JSON.stringify(createdObjects)}`,
		);
	}
	const splitShareId = createdObjects[0].objectId;

	return { digest, splitShareId };
}
