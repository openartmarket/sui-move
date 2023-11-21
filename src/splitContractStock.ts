import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./newWallet.js";

export type SplitContractStockParams = {
  contractStockId: string;
  quantity: number;
};

export type SplitContractStockResult = {
  digest: string;
  splitContractStockId: string;
};

export async function splitContractStock(
  executor: Wallet,
  params: SplitContractStockParams,
): Promise<SplitContractStockResult> {
  const response = await executor.execute(async (txb, packageId) => {
    const { contractStockId, quantity } = params;
    txb.moveCall({
      target: `${packageId}::open_art_market::split_contract_stock`,
      arguments: [txb.object(contractStockId), txb.pure(quantity)],
    });
  });
  const { digest } = response;

  const createdObjects = getCreatedObjects(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const splitContractStockId = createdObject.objectId;

  return { digest, splitContractStockId };
}
