import type { SuiObjectChangeCreated, SuiTransactionBlockResponse } from "@mysten/sui.js/client";

import { getCreatedObjects } from "./helpers.js";

export function findObjectsWithOwnerAddress(
  txRes: SuiTransactionBlockResponse,
  address: string,
): SuiObjectChangeCreated[] {
  const objects = getCreatedObjects(txRes);
  return objects.filter((obj) => {
    if (typeof obj.owner === "string") return false;
    return "AddressOwner" in obj.owner && obj.owner.AddressOwner === address;
  });
}
