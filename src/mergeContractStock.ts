import type { TransactionBlock } from "@mysten/sui.js/dist/cjs/builder";

import type { Executor } from "./Executor";

export type MergeContractStockParam = {
  toContractStockId: string;
  fromContractStockId: string;
};

export type MergeContractStockResult = {
  digest: string;
};

export async function mergeContractStock(
  executor: Executor,
  params: readonly MergeContractStockParam[],
): Promise<MergeContractStockResult> {
  const response = await executor.execute((txb, packageId) => {
    mergeContractStockCalls(txb, packageId, params);
  });

  const { digest } = response;
  return { digest };
}

export function mergeContractStockCalls(
  txb: TransactionBlock,
  packageId: string,
  params: readonly MergeContractStockParam[],
) {
  for (const { toContractStockId, fromContractStockId } of params) {
    txb.moveCall({
      target: `${packageId}::open_art_market::merge_contract_stocks`,
      arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)],
    });
  }
}
