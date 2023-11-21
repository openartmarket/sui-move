import type { SuiObjectData } from "@mysten/sui.js/client";

import { getContractStocks } from "./getContractStocks.js";
import type { MergeContractStockParam } from "./mergeContractStock.js";
import { mergeContractStock } from "./mergeContractStock.js";
import { splitContractStock } from "./splitContractStock.js";
import { transferContractStock } from "./transferContractStock.js";
import type { Wallet } from "./Wallet.js";

export type SplitMergeTransferParams = {
  packageId: string;
  fromWallet: Wallet;
  toWallet: Wallet;
  contractId: string;
  fromAddress: string;
  toAddress: string;
  quantity: number;
};

export type SplitMergeTransferResult = {
  digest: string;
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
  fromWallet,
  toWallet,
  contractId,
  fromAddress,
  toAddress,
  quantity,
}: SplitMergeTransferParams): Promise<SplitMergeTransferResult> {
  const fromContractStocks = await getContractStocks({
    suiClient: fromWallet.suiClient,
    owner: fromAddress,
    contractId,
    packageId,
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    fromContractStocks,
  )) {
    await mergeContractStock(fromWallet, [{ fromContractStockId, toContractStockId }]);
  }
  const { splitContractStockId } = await splitContractStock(fromWallet, {
    contractStockId: fromContractStocks[0].objectId,
    quantity,
  });
  const { digest } = await transferContractStock(fromWallet, {
    contractId,
    contractStockId: splitContractStockId,
    toAddress,
  });

  const toContractStocks = await getContractStocks({
    suiClient: toWallet.suiClient,
    owner: toAddress,
    contractId,
    packageId,
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    toContractStocks,
  )) {
    await mergeContractStock(toWallet, [{ fromContractStockId, toContractStockId }]);
  }
  return {
    digest,
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
