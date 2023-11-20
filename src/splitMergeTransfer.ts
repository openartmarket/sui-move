import type { Executor } from "./Executor";
import { getObjectData } from "./getters";
import { mergeContractStock } from "./mergeContractStock";
import { splitContractStock } from "./splitContractStock";
import { transferContractStock } from "./transferContractStock";

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
 * Takes care of merging and splitting so that aftet the transfer,
 * both addresses have a single stock.
 */
export async function splitMergeTransfer({
  fromExecutor,
  toExecutor,
  contractId,
  fromAddress,
  toAddress,
  quantity,
}: SplitMergeTransferParams) {
  // TODO: Refactor Executor so we can do the merge/split/transfer in a single transaction

  const { contractStockId } = await mergeAllContractStocks(fromExecutor, fromAddress, contractId);

  await splitContractStock(fromExecutor, {
    contractStockId,
    quantity,
  });

  await transferContractStock(fromExecutor, {
    contractId,
    contractStockId,
    toAddress,
  });

  await mergeAllContractStocks(toExecutor, toAddress, contractId);
}

async function mergeAllContractStocks(
  executor: Executor,
  owner: string,
  contractId: string,
): Promise<{ contractStockId: string }> {
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

  const contractStocks = response.data.map(getObjectData);
  const toContractStockId = contractStocks[0].objectId;
  const stocksToMerge = contractStocks.slice(1);
  for (const stock of stocksToMerge) {
    await mergeContractStock(executor, {
      toContractStockId,
      fromContractStockId: stock.objectId,
    });
  }

  return { contractStockId: toContractStockId };
}
