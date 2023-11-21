import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { TransactionBlock } from "@mysten/sui.js/transactions";

export interface Executor {
  readonly suiClient: SuiClient;
  execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

export type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;
