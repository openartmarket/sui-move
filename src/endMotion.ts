import type { AdminCapId, AssetId, Digest, MotionId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

export type EndMotionParams = {
	adminCapId: AdminCapId;
	assetId: AssetId;
	motionId: MotionId;
};

export type EndMotionResult = {
	digest: Digest;
};

export async function endMotion(
	wallet: Wallet,
	params: EndMotionParams,
): Promise<EndMotionResult> {
	const { adminCapId, assetId, motionId } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::end_motion`,
			arguments: [
				txb.object(adminCapId),
				txb.object(assetId),
				txb.object(motionId),
			],
		});
	});

	return { digest: toDigest(response.digest) };
}
