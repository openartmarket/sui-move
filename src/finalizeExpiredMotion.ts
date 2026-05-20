import type { AssetId, Digest, MotionId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

const SUI_CLOCK_OBJECT_ID = "0x6";

export type FinalizeExpiredMotionParams = {
	assetId: AssetId;
	motionId: MotionId;
};

export type FinalizeExpiredMotionResult = {
	digest: Digest;
};

/**
 * Permissionless: close a Motion whose deadline has passed. Releases the
 * asset's active-motion lock so Share movement can resume.
 */
export async function finalizeExpiredMotion(
	wallet: Wallet,
	params: FinalizeExpiredMotionParams,
): Promise<FinalizeExpiredMotionResult> {
	const { assetId, motionId } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::finalize_expired_motion`,
			arguments: [
				txb.object(assetId),
				txb.object(motionId),
				txb.object(SUI_CLOCK_OBJECT_ID),
			],
		});
	});
	return { digest: toDigest(response.digest) };
}
