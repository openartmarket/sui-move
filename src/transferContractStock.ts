import type { Wallet } from "./Wallet.js";

export type TransferContractStockParams = {
  contractId: string;
  contractStockId: string;
  toAddress: string;
};

export type TransferContractStockResult = {
  digest: string;
};

export async function transferContractStock(
  wallet: Wallet,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult> {
  const response = await wallet.execute(async (txb, packageId) => {
    const { contractId, contractStockId, toAddress } = params;
    txb.moveCall({
      target: `${packageId}::open_art_market::transfer_contract_stock`,
      arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(toAddress)],
    });
  });
  const { digest } = response;

  return { digest };
}
