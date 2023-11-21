import type { Executor } from "./Executor";
export type VoteParams = {
    contractId: string;
    motionId: string;
    choice: boolean;
};
export type VoteResult = {
    digest: string;
};
export declare function vote(executor: Executor, params: VoteParams): Promise<VoteResult>;
