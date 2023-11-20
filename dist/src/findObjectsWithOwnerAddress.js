import { getCreatedObjects } from "./helpers.js";
export function findObjectsWithOwnerAddress(txRes, address) {
    const objects = getCreatedObjects(txRes);
    return objects.filter((obj) => {
        if (typeof obj.owner === "string")
            return false;
        return "AddressOwner" in obj.owner && obj.owner.AddressOwner === address;
    });
}
//# sourceMappingURL=findObjectsWithOwnerAddress.js.map