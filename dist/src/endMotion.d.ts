import type { Executor } from "./Executor";
export type EndMotionParams = {
    adminCapId: string;
    motionId: string;
};
export type EndMotionResult = {
    digest: string;
};
export declare function endMotion(executor: Executor, params: EndMotionParams): Promise<EndMotionResult>;
