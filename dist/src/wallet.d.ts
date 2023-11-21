import type { Executor } from "./Executor";
import type { NetworkName } from "./types";
export interface Wallet {
    readonly address: string;
    readonly executor: Executor;
}
export type NewWalletParams = {
    network: NetworkName;
    packageId: string;
};
export declare function newWallet({ packageId, network }: NewWalletParams): Promise<Wallet>;
