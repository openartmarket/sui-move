import type { SuiObjectResponse } from "@mysten/sui.js/client";
export type ContractStock = {
    contractStockId: string;
    digest: string;
    contractId: string;
    quantity: number;
    productId: string;
};
export declare function toContractStock(response: SuiObjectResponse): ContractStock;
