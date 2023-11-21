import type { Wallet } from "./newWallet.js";

export type TransferContractStockParams = {
  contractId: string;
  contractStockId: string;
  toAddress: string;
};

export type TransferContractStockResult = {
  digest: string;
};

export async function transferContractStock(
  executor: Wallet,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult> {
  const response = await executor.execute(async (txb, packageId) => {
    const { contractId, contractStockId, toAddress } = params;
    txb.moveCall({
      target: `${packageId}::open_art_market::transfer_contract_stock`,
      arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(toAddress)],
    });
  });
  const { digest } = response;

  return { digest };
}
