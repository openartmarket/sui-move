import type { SuiObjectData } from "@mysten/sui/client";

import { getContractStocks } from "./getContractStocks.js";
import { getWalletQuantity } from "./getters.js";
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
  quantity,
}: SplitMergeTransferParams): Promise<SplitMergeTransferResult> {
  const fromContractStocks = await getContractStocks({
    suiClient: fromWallet.suiClient,
    owner: fromWallet.address,
    contractId,
    packageId,
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    fromContractStocks,
  )) {
    await mergeContractStock(fromWallet, [{ fromContractStockId, toContractStockId }]);
  }

  // Check if we need to split the stock
  const fromContractStocksAfterMerge = await getContractStocks({
    suiClient: fromWallet.suiClient,
    owner: fromWallet.address,
    contractId,
    packageId,
  });
  if (fromContractStocksAfterMerge.length !== 1) {
    throw new Error(
      `Expected a single stock after merge, but got ${JSON.stringify(
        fromContractStocksAfterMerge,
        null,
        2,
      )}`,
    );
  }

  const currentQuantity = await getWalletQuantity(
    fromWallet,
    fromContractStocksAfterMerge[0].objectId,
  );
  if (currentQuantity < quantity) {
    throw new Error(
      `Cannot transfer ${quantity} stocks, because there are only ${currentQuantity} stocks`,
    );
  }
  let contractStockId: string;
  if (currentQuantity > quantity) {
    const { splitContractStockId } = await splitContractStock(fromWallet, {
      contractStockId: fromContractStocksAfterMerge[0].objectId,
      quantity,
    });
    contractStockId = splitContractStockId;
  } else {
    contractStockId = fromContractStocks[0].objectId;
  }

  const { digest } = await transferContractStock(fromWallet, {
    contractId,
    contractStockId,
    toAddress: toWallet.address,
  });

  const toContractStocks = await getContractStocks({
    suiClient: toWallet.suiClient,
    owner: toWallet.address,
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
