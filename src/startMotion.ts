import type { AdminCapId, AssetId, Digest, MotionId } from "./brands.js";
import { toDigest, toMotionId } from "./brands.js";
import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

const SUI_CLOCK_OBJECT_ID = "0x6";

export type StartMotionParams = {
	adminCapId: AdminCapId;
	assetId: AssetId;
	/**
	 * The motion to vote on
	 */
	motion: string;
	/**
	 * Voting window length in milliseconds. The deadline is set to the
	 * current chain time plus this duration.
	 */
	durationMs: number;
};

export type StartMotionResult = {
	digest: Digest;
	motionId: MotionId;
};

export async function startMotion(
	wallet: Wallet,
	params: StartMotionParams,
): Promise<StartMotionResult> {
	const { adminCapId, assetId, motion, durationMs } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::start_motion`,
			arguments: [
				txb.object(adminCapId),
				txb.object(assetId),
				txb.pure.string(motion),
				txb.pure.u64(durationMs),
				txb.object(SUI_CLOCK_OBJECT_ID),
			],
		});
	});

	const digest = toDigest(response.digest);
	const createdObjects = getCreatedObjects(response);
	if (createdObjects.length !== 1) {
		throw new Error(
			`Expected 1 created object, got ${JSON.stringify(createdObjects)}`,
		);
	}
	const motionId = toMotionId(createdObjects[0].objectId);

	return { digest, motionId };
}
