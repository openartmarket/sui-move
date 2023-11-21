import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

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
  executor: Wallet,
  params: StartMotionParams,
): Promise<StartMotionResult> {
  const { adminCapId, contractId, motion } = params;
  const response = await executor.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::start_vote`,
      arguments: [txb.object(adminCapId), txb.pure(contractId), txb.pure(motion)],
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
