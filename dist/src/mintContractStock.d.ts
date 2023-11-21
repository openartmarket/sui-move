import type { Executor } from "./Executor";
export type MintContractStockParam = {
    adminCapId: string;
    contractId: string;
    receiverAddress: string;
    quantity: number;
};
export type MintContractStockResult = {
    contractStockIds: readonly string[];
    digest: string;
};
export declare function mintContractStock(executor: Executor, params: MintContractStockParam[]): Promise<MintContractStockResult>;
