import type { Executor } from "./Executor";
export type TransferContractStockParams = {
    contractId: string;
    contractStockId: string;
    toAddress: string;
};
export type TransferContractStockResult = {
    digest: string;
};
export declare function transferContractStock(executor: Executor, params: TransferContractStockParams): Promise<TransferContractStockResult>;
