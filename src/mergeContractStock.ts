import type { Wallet } from "./Wallet.js";

export type MergeContractStockParam = {
  toContractStockId: string;
  fromContractStockId: string;
};

export type MergeContractStockResult = {
  digest: string;
};

export async function mergeContractStock(
  wallet: Wallet,
  params: readonly MergeContractStockParam[],
): Promise<MergeContractStockResult> {
  const response = await wallet.execute(async (txb, packageId) => {
    for (const { toContractStockId, fromContractStockId } of params) {
      txb.moveCall({
        target: `${packageId}::open_art_market::merge_contract_stocks`,
        arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)],
      });
    }
  });

  const { digest } = response;
  return { digest };
}
