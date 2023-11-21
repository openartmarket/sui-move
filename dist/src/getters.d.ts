import type { SuiObjectChangeCreated, SuiObjectData, SuiObjectResponse, SuiParsedData, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
export declare function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[];
export declare function getObjectData(response: SuiObjectResponse): SuiObjectData;
export declare function getParsedData(data: SuiObjectData): SuiParsedData;
export declare function getType(data: SuiParsedData): string;
export declare function getStringField(data: SuiParsedData, key: string): string;
export declare function getIntField(data: SuiParsedData, key: string): number;
