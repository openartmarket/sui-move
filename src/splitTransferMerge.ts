import type { SuiObjectData } from "@mysten/sui.js/dist/cjs/client";

import type { Executor } from "./Executor";
import { getObjectData, getParsedData, getStringField, getType } from "./getters";
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
  const fromContractStocks = await getContractStocks(
    fromExecutor,
    fromAddress,
    contractId,
    packageId,
  );
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

  const toContractStocks = await getContractStocks(toExecutor, toAddress, contractId, packageId);
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

async function getContractStocks(
  executor: Executor,
  owner: string,
  contractId: string,
  packageId: string,
  cursor?: string,
): Promise<readonly SuiObjectData[]> {
  const type = `${packageId}::open_art_market::ContractStock`;
  const response = await executor.suiClient.getOwnedObjects({
    owner,
    options: {
      showContent: true,
    },
    cursor,
  });
  const data = response.data.map(getObjectData).filter((object) => {
    const parsedData = getParsedData(object);
    return getType(parsedData) === type && getStringField(parsedData, "contract_id") === contractId;
  });
  if (response.hasNextPage && response.nextCursor) {
    const nextData = await getContractStocks(
      executor,
      owner,
      contractId,
      packageId,
      response.nextCursor,
    );
    return [...data, ...nextData];
  }

  return data;
}
