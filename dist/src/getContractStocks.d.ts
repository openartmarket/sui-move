import type { SuiClient, SuiObjectData } from "@mysten/sui.js/client";
export type GetContractStocksParams = {
    suiClient: SuiClient;
    owner: string;
    contractId: string;
    packageId: string;
    cursor?: string;
};
/**
 * Returns all contract stocks of a contract owned by an address.
 */
export declare function getContractStocks(params: GetContractStocksParams): Promise<readonly SuiObjectData[]>;
