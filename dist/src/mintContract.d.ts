import type { Executor } from "./Executor";
import type { Currency } from "./types";
export type MintContractParams = {
    adminCapId: string;
    totalShareCount: number;
    sharePrice: number;
    outgoingPrice: number;
    name: string;
    artist: string;
    creationTimestampMillis: number;
    description: string;
    currency: Currency;
    image: string;
};
export type MintContractResult = {
    contractId: string;
    digest: string;
};
export declare function mintContract(executor: Executor, params: MintContractParams): Promise<MintContractResult>;
