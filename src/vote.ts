import type { Executor } from "./Executor";

export type VoteParams = {
  contractId: string;
  motionId: string;
  choice: boolean;
};

export type VoteResult = {
  digest: string;
};

export async function vote(executor: Executor, params: VoteParams): Promise<VoteResult> {
  const { contractId, motionId, choice } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::vote`,
      arguments: [txb.object(contractId), txb.object(motionId), txb.pure(choice)],
    });
  });
  const { digest } = response;
  return { digest };
}
