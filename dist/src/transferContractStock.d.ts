import type { Executor } from "./Executor";
export type TransferContractStockParams = {
    contractId: string;
    contractStockId: string;
    receiverAddress: string;
};
export type TransferContractStockResult = {
    digest: string;
};
export declare function transferContractStock(executor: Executor, params: TransferContractStockParams): Promise<TransferContractStockResult>;
