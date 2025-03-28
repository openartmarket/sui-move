import type { Wallet } from "./Wallet.js";
import { getCreatedObjects } from "./getters.js";

export type StartMotionParams = {
  adminCapId: string;
  contractId: string;
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
  const { adminCapId, contractId, motion } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::start_vote`,
      arguments: [txb.object(adminCapId), txb.object(contractId), txb.pure.string(motion)],
    });
  });
  const { digest } = response;

  const createdObjects = getCreatedObjects(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const motionId = createdObject.objectId;

  return { digest, motionId };
}
