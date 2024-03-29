import type { Wallet } from "./Wallet.js";

export type EndMotionParams = {
  adminCapId: string;
  motionId: string;
};

export type EndMotionResult = {
  digest: string;
};

export async function endMotion(wallet: Wallet, params: EndMotionParams): Promise<EndMotionResult> {
  const { adminCapId, motionId } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::end_vote`,
      arguments: [txb.object(adminCapId), txb.object(motionId)],
    });
  });
  const { digest } = response;

  return { digest };
}
