import type { Executor } from "./Executor";
import { findObjectsWithOwnerAddress } from "./findObjectsWithOwnerAddress";

export type SplitContractStockParams = {
  contractStockId: string;
  quantity: number;
};

export type SplitContractStockResult = {
  digest: string;
  splitContractStockId: string;
};

export async function splitContractStock(
  executor: Executor,
  params: SplitContractStockParams,
): Promise<SplitContractStockResult> {
  const { contractStockId, quantity } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::split_contract_stock`,
      arguments: [txb.object(contractStockId), txb.pure(quantity)],
    });
  });
  const { digest } = response;

  const contractStocks = findObjectsWithOwnerAddress(response, executor.address);
  if (contractStocks.length !== 1)
    throw new Error(`Expected 1 contract stock, got ${JSON.stringify(contractStocks)}`);
  const splitContractStockId = contractStocks[0].objectId;

  return { digest, splitContractStockId };
}
