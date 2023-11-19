import type { Executor } from "./Executor";
import {
  getCreatedObjectsWithOwnerAddress,
  getObjectData,
  getParsedData,
  getStringField,
} from "./getters";

export type MintContractStockParams = {
  adminCapId: string;
  contractId: string;
  receiverAddress: string;
  quantity: number;
};

export type MintContractStockResult = {
  contractStockIds: readonly string[];
  digest: string;
};

export async function mintContractStock(
  executor: Executor,
  paramsArray: MintContractStockParams[],
): Promise<MintContractStockResult> {
  const response = await executor.execute((txb, packageId) => {
    for (const { adminCapId, contractId, quantity, receiverAddress } of paramsArray) {
      txb.moveCall({
        target: `${packageId}::open_art_market::mint_contract_stock`,
        arguments: [
          txb.object(adminCapId),
          txb.object(contractId),
          txb.pure(quantity),
          txb.pure(receiverAddress),
        ],
      });
    }
  });

  const contractStockIds: string[] = [];
  const receiverAddresses = new Set(paramsArray.map(({ receiverAddress }) => receiverAddress));
  for (const receiverAddress of receiverAddresses) {
    const objects = getCreatedObjectsWithOwnerAddress(response, receiverAddress);
    for (const object of objects) {
      const contractStock = await executor.client.getObject({
        id: object.objectId,
        options: { showContent: true },
      });
      const objectData = getObjectData(contractStock);
      const parsedData = getParsedData(objectData);
      const contractStockId = getStringField(parsedData, "contract_id");
      contractStockIds.push(contractStockId);
    }
  }

  if (contractStockIds.length !== paramsArray.length) {
    throw new Error(
      `Expected ${paramsArray.length} contract stock ids, got ${JSON.stringify(contractStockIds)}`,
    );
  }

  const { digest } = response;
  return { contractStockIds, digest };
}
