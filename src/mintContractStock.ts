import { getAddressOwner, getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type MintContractStockParams = {
  adminCapId: string;
  contractId: string;
  receiverAddress: string;
  quantity: number;
};

export type MintContractStockResult = {
  contractStockId: string;
  digest: string;
};

export async function mintContractStock(
  wallet: Wallet,
  params: MintContractStockParams,
): Promise<MintContractStockResult> {
  const { adminCapId, contractId, quantity, receiverAddress } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::mint_contract_stock`,
      arguments: [
        txb.object(adminCapId),
        txb.object(contractId),
        txb.pure.u64(quantity),
        txb.pure.address(receiverAddress),
      ],
    });
  });
  const { digest } = response;
  const objects = getCreatedObjects(response);
  const ownedObjects = objects.filter((obj) => getAddressOwner(obj) !== null);
  if (ownedObjects.length !== 1) {
    throw new Error(`Expected 1 owned objects, got ${JSON.stringify(ownedObjects, null, 2)}`);
  }
  const contractStockId = ownedObjects[0].objectId;
  return { contractStockId, digest };
}
