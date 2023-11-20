import type { Executor } from "./Executor";
export type MergeContractStockParams = {
    toContractStockId: string;
    fromContractStockId: string;
};
export type MergeContractStockResult = {
    digest: string;
};
export declare function mergeContractStock(executor: Executor, params: MergeContractStockParams): Promise<MergeContractStockResult>;
