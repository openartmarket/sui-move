import type { Wallet } from "./Wallet.js";
export type VoteParams = {
  contractId: string;
  motionId: string;
  choice: boolean;
};

export type VoteResult = {
  digest: string;
};

export async function vote(wallet: Wallet, params: VoteParams): Promise<VoteResult> {
  const { contractId, motionId, choice } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::vote`,
      arguments: [txb.object(contractId), txb.object(motionId), txb.pure.bool(choice)],
    });
  });
  const { digest } = response;
  return { digest };
}
