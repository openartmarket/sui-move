import type { SuiObjectData } from "@mysten/sui.js/client";

import type { Executor } from "./Executor";
import { getContractStocks } from "./getContractStocks";
import type { MergeContractStockParam } from "./mergeContractStock";
import { mergeContractStock } from "./mergeContractStock";
import { splitContractStock } from "./splitContractStock";
import { transferContractStock } from "./transferContractStock";

export type SplitMergeTransferParams = {
  packageId: string;
  fromExecutor: Executor;
  toExecutor: Executor;
  contractId: string;
  fromAddress: string;
  toAddress: string;
  quantity: number;
};

export type SplitMergeTransferResult = {
  fromContractStockId: string;
  toContractStockId: string;
};

/**
 * Transfers a quantity of contract stock from one address to another.
 * Takes care of splitting and merging so that aftet the transfer,
 * both addresses have a single stock.
 */
export async function splitTransferMerge({
  packageId,
  fromExecutor,
  toExecutor,
  contractId,
  fromAddress,
  toAddress,
  quantity,
}: SplitMergeTransferParams): Promise<SplitMergeTransferResult> {
  const fromContractStocks = await getContractStocks({
    suiClient: fromExecutor.suiClient,
    owner: fromAddress,
    contractId,
    packageId,
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    fromContractStocks,
  )) {
    await mergeContractStock(fromExecutor, [{ fromContractStockId, toContractStockId }]);
  }
  const { splitContractStockId } = await splitContractStock(fromExecutor, {
    contractStockId: fromContractStocks[0].objectId,
    quantity,
  });
  await transferContractStock(fromExecutor, {
    contractId,
    contractStockId: splitContractStockId,
    toAddress,
  });

  const toContractStocks = await getContractStocks({
    suiClient: toExecutor.suiClient,
    owner: toAddress,
    contractId,
    packageId,
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    toContractStocks,
  )) {
    await mergeContractStock(toExecutor, [{ fromContractStockId, toContractStockId }]);
  }
  return {
    fromContractStockId: fromContractStocks[0].objectId,
    toContractStockId: toContractStocks[0].objectId,
  };
}

function makeMergeContractStockParams(
  contractStocks: readonly SuiObjectData[],
): readonly MergeContractStockParam[] {
  const stocksToMerge = contractStocks.slice(1);
  return stocksToMerge.map((stock) => ({
    fromContractStockId: stock.objectId,
    toContractStockId: contractStocks[0].objectId,
  }));
}
