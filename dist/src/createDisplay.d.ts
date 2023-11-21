import type { Executor } from "./Executor";
export type CreateDisplayParams = {
    publisherId: string;
    fields: Record<string, string>;
    type: "Contract" | "ContractStock";
    address: string;
};
export type CreateDisplayResult = {
    digest: string;
};
export declare const ContractFields: {
    name: string;
    artist: string;
    description: string;
    currency: string;
    image_url: string;
    project_url: string;
};
export declare const ContractStockFields: {
    name: string;
    artist: string;
    description: string;
    currency: string;
    image_url: string;
    thumbnail_url: string;
    project_url: string;
};
export declare function createDisplay(executor: Executor, params: CreateDisplayParams): Promise<CreateDisplayResult>;
