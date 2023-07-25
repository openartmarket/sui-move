"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findObjectIdInOwnedObjectList = exports.findObjectIdWithOwnerAddress = void 0;
const sui_js_1 = require("@mysten/sui.js");
function findObjectIdWithOwnerAddress(txRes, address) {
    const objects = (0, sui_js_1.getCreatedObjects)(txRes);
    if (!objects)
        throw new Error("Failed to mint artwork shard");
    const objectWithOwnerAddress = objects.find((obj) => {
        if (typeof obj.owner === 'string')
            return false;
        if ('AddressOwner' in obj.owner) {
            return obj.owner.AddressOwner === address;
        }
        else {
            return false;
        }
    });
    if (!objectWithOwnerAddress)
        throw new Error(`Failed to find object with owner address ${address} in objects: ${JSON.stringify(objects, null, 2)}`);
    const objectId = objectWithOwnerAddress.reference.objectId;
    return objectId;
}
exports.findObjectIdWithOwnerAddress = findObjectIdWithOwnerAddress;
function findObjectIdInOwnedObjectList(list, objectId) {
    let object = undefined;
    list.data.find((obj) => {
        if (obj.data.objectId === objectId) {
            object = obj;
            return true;
        }
        return false;
    });
    if (object === undefined)
        return false;
    return object;
}
exports.findObjectIdInOwnedObjectList = findObjectIdInOwnedObjectList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFnRjtBQWtCaEYsU0FBZ0IsNEJBQTRCLENBQUMsS0FBa0MsRUFBRSxPQUFlO0lBQzlGLE1BQU0sT0FBTyxHQUFHLElBQUEsMEJBQWlCLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDLE9BQU87UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDOUQsTUFBTSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbEQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ2hELElBQUksY0FBYyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7WUFDL0IsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUM7U0FDM0M7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxzQkFBc0I7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxPQUFPLGdCQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BKLE1BQU0sUUFBUSxHQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDM0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQWRELG9FQWNDO0FBRUQsU0FBZ0IsNkJBQTZCLENBQUMsSUFBcUIsRUFBRSxRQUFnQjtJQUNuRixJQUFJLE1BQU0sR0FBa0IsU0FBUyxDQUFDO0lBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7UUFDMUIsSUFBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDakMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNiLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxNQUFNLEtBQUssU0FBUztRQUFFLE9BQU8sS0FBSyxDQUFBO0lBQ3RDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFYRCxzRUFXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldENyZWF0ZWRPYmplY3RzLCBTdWlUcmFuc2FjdGlvbkJsb2NrUmVzcG9uc2UgfSBmcm9tIFwiQG15c3Rlbi9zdWkuanNcIjtcblxuZXhwb3J0IHR5cGUgT3duZWRPYmplY3RMaXN0ID0ge1xuICBkYXRhOiBEYXVtW11cbiAgbmV4dEN1cnNvcjogc3RyaW5nXG4gIGhhc05leHRQYWdlOiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIERhdW0gPSB7XG4gIGRhdGE6IERhdGFcbn1cblxuZXhwb3J0IHR5cGUgRGF0YSA9IHtcbiAgb2JqZWN0SWQ6IHN0cmluZ1xuICB2ZXJzaW9uOiBzdHJpbmdcbiAgZGlnZXN0OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPYmplY3RJZFdpdGhPd25lckFkZHJlc3ModHhSZXM6IFN1aVRyYW5zYWN0aW9uQmxvY2tSZXNwb25zZSwgYWRkcmVzczogc3RyaW5nKSB7XG4gIGNvbnN0IG9iamVjdHMgPSBnZXRDcmVhdGVkT2JqZWN0cyh0eFJlcyk7XG4gIGlmICghb2JqZWN0cykgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIG1pbnQgYXJ0d29yayBzaGFyZFwiKTtcbiAgY29uc3Qgb2JqZWN0V2l0aE93bmVyQWRkcmVzcyA9IG9iamVjdHMuZmluZCgob2JqKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBvYmoub3duZXIgPT09ICdzdHJpbmcnKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCdBZGRyZXNzT3duZXInIGluIG9iai5vd25lcikge1xuICAgICAgcmV0dXJuIG9iai5vd25lci5BZGRyZXNzT3duZXIgPT09IGFkZHJlc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIW9iamVjdFdpdGhPd25lckFkZHJlc3MpIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZpbmQgb2JqZWN0IHdpdGggb3duZXIgYWRkcmVzcyAke2FkZHJlc3N9IGluIG9iamVjdHM6ICR7SlNPTi5zdHJpbmdpZnkob2JqZWN0cywgbnVsbCwgMil9YCk7XG4gIGNvbnN0IG9iamVjdElkID0gb2JqZWN0V2l0aE93bmVyQWRkcmVzcy5yZWZlcmVuY2Uub2JqZWN0SWQ7XG4gIHJldHVybiBvYmplY3RJZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPYmplY3RJZEluT3duZWRPYmplY3RMaXN0KGxpc3Q6IE93bmVkT2JqZWN0TGlzdCwgb2JqZWN0SWQ6IHN0cmluZyk6IERhdW0gfCBmYWxzZSB7XG4gIGxldCBvYmplY3Q6RGF1bXx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxpc3QuZGF0YS5maW5kKChvYmo6RGF1bSkgPT4ge1xuICAgIGlmKG9iai5kYXRhLm9iamVjdElkID09PSBvYmplY3RJZCkge1xuICAgICAgb2JqZWN0ID0gb2JqO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG4gIGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBvYmplY3Q7XG59Il19