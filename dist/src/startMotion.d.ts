import type { Executor } from "./Executor";
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
export declare function startMotion(executor: Executor, params: StartMotionParams): Promise<StartMotionResult>;
