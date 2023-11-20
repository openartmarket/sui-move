import type { TransactionBlock } from "@mysten/sui.js/builder";

import type { Executor } from "./Executor";

export type TransferContractStockParams = {
  contractId: string;
  contractStockId: string;
  toAddress: string;
};

export type TransferContractStockResult = {
  digest: string;
};

export async function transferContractStock(
  executor: Executor,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult> {
  const response = await executor.execute(async (txb, packageId) => {
    transferContractStockCall(txb, packageId, params);
  });
  const { digest } = response;

  return { digest };
}

export function transferContractStockCall(
  txb: TransactionBlock,
  packageId: string,
  params: TransferContractStockParams,
) {
  const { contractId, contractStockId, toAddress } = params;
  txb.moveCall({
    target: `${packageId}::open_art_market::transfer_contract_stock`,
    arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(toAddress)],
  });
}
