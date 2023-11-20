import type { SuiObjectData } from "@mysten/sui.js/dist/cjs/client";

import type { Executor } from "./Executor";
import { getObjectData } from "./getters";
import type { MergeContractStockParam } from "./mergeContractStock";
import { mergeContractStockCalls } from "./mergeContractStock";
import { splitContractStockCall } from "./splitContractStock";
import { transferContractStockCall } from "./transferContractStock";

export type SplitMergeTransferParams = {
  fromExecutor: Executor;
  toExecutor: Executor;
  contractId: string;
  fromAddress: string;
  toAddress: string;
  quantity: number;
};

/**
 * Transfers a quantity of contract stock from one address to another.
 * Takes care of splitting and merging so that aftet the transfer,
 * both addresses have a single stock.
 */
export async function splitTransferMerge({
  fromExecutor,
  toExecutor,
  contractId,
  fromAddress,
  toAddress,
  quantity,
}: SplitMergeTransferParams) {
  // Run merge/split/transfer in a single transaction block
  await fromExecutor.execute(async (txb, packageId) => {
    const contractStocks = await getContractStocks(fromExecutor, fromAddress, contractId);
    const mergeContractStockParams = makeMergeContractStockParams(contractStocks);
    // Ideally the stocks are already merged, but in case they are not, merge them
    mergeContractStockCalls(txb, packageId, mergeContractStockParams);

    const contractStockId = contractStocks[0].objectId;
    splitContractStockCall(txb, packageId, { contractStockId, quantity });
    transferContractStockCall(txb, packageId, { contractId, contractStockId, toAddress });
  });

  await toExecutor.execute(async (txb, packageId) => {
    const contractStocks = await getContractStocks(toExecutor, toAddress, contractId);
    const mergeContractStockParams = makeMergeContractStockParams(contractStocks);
    mergeContractStockCalls(txb, packageId, mergeContractStockParams);
  });
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
): Promise<readonly SuiObjectData[]> {
  const response = await executor.suiClient.getOwnedObjects({
    owner,
    options: {
      showContent: true,
    },
  });
  if (response.hasNextPage) {
    throw new Error("TODO: implement pagination");
  }
  console.log(
    `TODO: filter on contractId=${contractId} so we don't merge EVERYTHING the user owns`,
  );

  return response.data.map(getObjectData);
}
