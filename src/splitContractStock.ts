import type { TransactionBlock } from "@mysten/sui.js/builder";

import type { Executor } from "./Executor";
import { getCreatedObjects } from "./getters";

export type SplitContractStockParams = {
  contractStockId: string;
  quantity: number;
};

export type SplitContractStockResult = {
  digest: string;
  splitContractStockId: string;
};

export async function splitContractStock(
  executor: Executor,
  params: SplitContractStockParams,
): Promise<SplitContractStockResult> {
  const response = await executor.execute(async (txb, packageId) => {
    splitContractStockCall(txb, packageId, params);
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

export function splitContractStockCall(
  txb: TransactionBlock,
  packageId: string,
  params: SplitContractStockParams,
) {
  const { contractStockId, quantity } = params;
  txb.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [txb.object(contractStockId), txb.pure(quantity)],
  });
}
