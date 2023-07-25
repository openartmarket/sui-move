import { getCreatedObjects, SuiTransactionBlockResponse } from "@mysten/sui.js";

import { Daum, OwnedObjectList } from "./types";

export function findObjectIdWithOwnerAddress(txRes: SuiTransactionBlockResponse, address: string) {
  const objects = getCreatedObjects(txRes);
  if (!objects) throw new Error("Failed to mint artwork shard");
  const objectWithOwnerAddress = objects.find((obj) => {
    if (typeof obj.owner === "string") return false;
    if ("AddressOwner" in obj.owner) {
      return obj.owner.AddressOwner === address;
    } else {
      return false;
    }
  });
  if (!objectWithOwnerAddress)
    throw new Error(
      `Failed to find object with owner address ${address} in objects: ${JSON.stringify(
        objects,
        null,
        2
      )}`
    );
  const objectId = objectWithOwnerAddress.reference.objectId;
  return objectId;
}

export function findObjectIdInOwnedObjectList(
  list: OwnedObjectList,
  objectId: string
): Daum | false {
  let object: Daum | undefined = undefined;
  list.data.find((obj: Daum) => {
    if (obj.data.objectId === objectId) {
      object = obj;
      return true;
    }
    return false;
  });
  if (object === undefined) return false;
  return object;
}
