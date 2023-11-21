import type { Executor } from "./Executor";
import type { NetworkName } from "./types";
export type ExecutorParams = SuiExecutorParams | ShinamiExecutorParams;
export type SuiExecutorParams = {
    type: "sui";
    packageId: string;
    network: NetworkName;
    phrase: string;
};
export type ShinamiExecutorParams = {
    type: "shinami";
    packageId: string;
    network: NetworkName;
    shinamiAccessKey: string;
    onBehalfOf: string;
    walletId: string;
    secret: string;
};
export declare function makeExecutor(params: ExecutorParams): Executor;
