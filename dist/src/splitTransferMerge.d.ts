import type { Executor } from "./Executor";
export type SplitMergeTransferParams = {
    packageId: string;
    fromExecutor: Executor;
    toExecutor: Executor;
    contractId: string;
    fromAddress: string;
    toAddress: string;
    quantity: number;
};
export type SplitMergeTransferResult = {
    digest: string;
    fromContractStockId: string;
    toContractStockId: string;
};
/**
 * Transfers a quantity of contract stock from one address to another.
 * Takes care of splitting and merging so that aftet the transfer,
 * both addresses have a single stock.
 */
export declare function splitTransferMerge({ packageId, fromExecutor, toExecutor, contractId, fromAddress, toAddress, quantity, }: SplitMergeTransferParams): Promise<SplitMergeTransferResult>;
