import type { MintContractParams } from "../src";
import type { Wallet } from "../src/wallet";
export declare const PUBLISHER_ID: string;
export declare const ADMIN_CAP_ID: string;
export declare const ADMIN_ADDRESS: string;
export declare const ADMIN_PHRASE: string;
export declare const PACKAGE_ID: string;
export declare const adminExecutor: import("../src").Executor;
export declare function makeWallet(): Promise<Wallet>;
export declare const mintContractOptions: MintContractParams;
/**
 * Get the quantity of a contract or a contract stock.
 */
export declare function getQuantity(wallet: Wallet, id: string): Promise<number>;
