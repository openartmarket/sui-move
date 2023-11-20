import type { Executor } from "./Executor";

export type TransferContractStockParams = {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};

export type TransferContractStockResult = {
  digest: string;
};

export async function transferContractStock(
  executor: Executor,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult> {
  const { contractId, contractStockId, receiverAddress } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::transfer_contract_stock`,
      arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(receiverAddress)],
    });
  });
  const { digest } = response;

  return { digest };
}
