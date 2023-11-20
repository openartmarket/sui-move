import type { SuiClient } from "@mysten/sui.js/client";
export declare function getAvailableStock(client: SuiClient, contractId: string): Promise<number>;
