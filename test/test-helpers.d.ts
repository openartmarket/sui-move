import { PaginatedObjectsResponse, SuiObjectResponse } from "@mysten/sui.js";
export declare function getObject(objectId: string): Promise<SuiObjectResponse>;
export declare function getOwnedObjects(address: string): Promise<PaginatedObjectsResponse>;
