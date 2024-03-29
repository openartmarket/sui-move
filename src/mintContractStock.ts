import { getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type MintContractStockParam = {
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
  wallet: Wallet,
  params: MintContractStockParam[],
): Promise<MintContractStockResult> {
  const response = await wallet.execute(async (txb, packageId) => {
    for (const { adminCapId, contractId, quantity, receiverAddress } of params) {
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

  const addressOwnedObjects = getCreatedObjects(response).filter(
    (object) => typeof object.owner !== "string" && "AddressOwner" in object.owner,
  );
  const contractStockIds = addressOwnedObjects.map((object) => object.objectId);

  if (contractStockIds.length !== params.length) {
    throw new Error(
      `Expected ${params.length} contract stock ids, got ${JSON.stringify(contractStockIds)}`,
    );
  }

  const { digest } = response;
  return { contractStockIds, digest };
}
