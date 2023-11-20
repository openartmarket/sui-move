import type { Executor } from "./Executor";

export type MergeContractStockParams = {
  toContractStockId: string;
  fromContractStockId: string;
};

export type MergeContractStockResult = {
  digest: string;
};

export async function mergeContractStock(
  executor: Executor,
  params: MergeContractStockParams,
): Promise<MergeContractStockResult> {
  const { toContractStockId, fromContractStockId } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::merge_contract_stocks`,
      arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)],
    });
  });

  const { digest } = response;
  return { digest };
}
