import type { SuiObjectData } from "@mysten/sui.js/client";
export type ContractStock = {
    contractStockId: string;
    digest: string;
    contractId: string;
    quantity: number;
    productId: string;
};
export declare function toContractStock(objectData: SuiObjectData): ContractStock;
