import type { Executor } from "./Executor";
export type MergeContractStockParam = {
    toContractStockId: string;
    fromContractStockId: string;
};
export type MergeContractStockResult = {
    digest: string;
};
export declare function mergeContractStock(executor: Executor, params: readonly MergeContractStockParam[]): Promise<MergeContractStockResult>;
