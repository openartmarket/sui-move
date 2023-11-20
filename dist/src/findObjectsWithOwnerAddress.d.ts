import type { SuiObjectChangeCreated, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
export declare function findObjectsWithOwnerAddress(txRes: SuiTransactionBlockResponse, address: string): SuiObjectChangeCreated[];
