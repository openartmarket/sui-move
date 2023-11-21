import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient, ShinamiWalletSigner } from "@shinami/clients";
export interface Executor {
    readonly suiClient: SuiClient;
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;
export type SuiExecutorParams = {
    suiClient: SuiClient;
    packageId: string;
    keypair: Keypair;
};
export declare class SuiExecutor implements Executor {
    private readonly params;
    readonly suiClient: SuiClient;
    constructor(params: SuiExecutorParams);
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
export type ShinamiExecutorParams = {
    suiClient: SuiClient;
    gasClient: GasStationClient;
    packageId: string;
    onBehalfOf: string;
    signer: ShinamiWalletSigner;
};
export declare class ShinamiExecutor implements Executor {
    private readonly params;
    readonly suiClient: SuiClient;
    constructor(params: ShinamiExecutorParams);
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
export {};
