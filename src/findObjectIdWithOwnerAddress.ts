import { getCreatedObjects, SuiTransactionBlockResponse } from "@mysten/sui.js";

export function findObjectIdWithOwnerAddress(txRes: SuiTransactionBlockResponse, address: string) {
  const objects = getCreatedObjects(txRes);
  if (!objects) throw new Error("Failed to mint artwork shard");
  const objectWithOwnerAddress = objects.find((obj) => {
    if (typeof obj.owner === 'string') return false;
    if ('AddressOwner' in obj.owner) {
      return obj.owner.AddressOwner === address;
    } else {
      return false;
    }
  });
  if (!objectWithOwnerAddress) throw new Error(`Failed to find object with owner address ${address} in objects: ${JSON.stringify(objects, null, 2)}`);
  const objectId = objectWithOwnerAddress.reference.objectId;
  return objectId;
}