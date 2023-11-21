import type { Executor } from "./Executor";
export type SplitContractStockParams = {
    contractStockId: string;
    quantity: number;
};
export type SplitContractStockResult = {
    digest: string;
    splitContractStockId: string;
};
export declare function splitContractStock(executor: Executor, params: SplitContractStockParams): Promise<SplitContractStockResult>;
