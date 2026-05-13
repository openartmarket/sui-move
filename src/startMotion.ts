import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type StartMotionParams = {
	adminCapId: string;
	assetId: string;
	/**
	 * The motion to vote on
	 */
	motion: string;
};

export type StartMotionResult = {
	digest: string;
	motionId: string;
};

export async function startMotion(
	wallet: Wallet,
	params: StartMotionParams,
): Promise<StartMotionResult> {
	const { adminCapId, assetId, motion } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::start_motion`,
			arguments: [
				txb.object(adminCapId),
				txb.pure.id(assetId),
				txb.pure.string(motion),
			],
		});
	});
	const { digest } = response;

	const createdObjects = getCreatedObjects(response);
	if (createdObjects.length !== 1) {
		throw new Error(
			`Expected 1 created object, got ${JSON.stringify(createdObjects)}`,
		);
	}
	const motionId = createdObjects[0].objectId;

	return { digest, motionId };
}
