import type { AssetId, Digest, MotionId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

export type VoteParams = {
	assetId: AssetId;
	motionId: MotionId;
	choice: boolean;
};

export type VoteResult = {
	digest: Digest;
};

export async function vote(
	wallet: Wallet,
	params: VoteParams,
): Promise<VoteResult> {
	const { assetId, motionId, choice } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::cast_vote`,
			arguments: [
				txb.object(assetId),
				txb.object(motionId),
				txb.pure.bool(choice),
			],
		});
	});
	return { digest: toDigest(response.digest) };
}
