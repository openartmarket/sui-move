"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findObjectIdInOwnedObjectList = exports.findObjectIdWithOwnerAddress = void 0;
const sui_js_1 = require("@mysten/sui.js");
function findObjectIdWithOwnerAddress(txRes, address) {
    const objects = (0, sui_js_1.getCreatedObjects)(txRes);
    if (!objects)
        throw new Error("Failed to mint artwork shard");
    const objectWithOwnerAddress = objects.find((obj) => {
        if (typeof obj.owner === "string")
            return false;
        if ("AddressOwner" in obj.owner) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZE9iamVjdElkV2l0aE93bmVyQWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFnRjtBQUloRixTQUFnQiw0QkFBNEIsQ0FBQyxLQUFrQyxFQUFFLE9BQWU7SUFDOUYsTUFBTSxPQUFPLEdBQUcsSUFBQSwwQkFBaUIsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsT0FBTztRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM5RCxNQUFNLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNsRCxJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDaEQsSUFBSSxjQUFjLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUMvQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQztTQUMzQzthQUFNO1lBQ0wsT0FBTyxLQUFLLENBQUM7U0FDZDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHNCQUFzQjtRQUN6QixNQUFNLElBQUksS0FBSyxDQUNiLDRDQUE0QyxPQUFPLGdCQUFnQixJQUFJLENBQUMsU0FBUyxDQUMvRSxPQUFPLEVBQ1AsSUFBSSxFQUNKLENBQUMsQ0FDRixFQUFFLENBQ0osQ0FBQztJQUNKLE1BQU0sUUFBUSxHQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDM0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQXJCRCxvRUFxQkM7QUFFRCxTQUFnQiw2QkFBNkIsQ0FDM0MsSUFBcUIsRUFDckIsUUFBZ0I7SUFFaEIsSUFBSSxNQUFNLEdBQXFCLFNBQVMsQ0FBQztJQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQVMsRUFBRSxFQUFFO1FBQzNCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDYixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztJQUNILElBQUksTUFBTSxLQUFLLFNBQVM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN2QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBZEQsc0VBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRDcmVhdGVkT2JqZWN0cywgU3VpVHJhbnNhY3Rpb25CbG9ja1Jlc3BvbnNlIH0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IERhdW0sIE93bmVkT2JqZWN0TGlzdCB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kT2JqZWN0SWRXaXRoT3duZXJBZGRyZXNzKHR4UmVzOiBTdWlUcmFuc2FjdGlvbkJsb2NrUmVzcG9uc2UsIGFkZHJlc3M6IHN0cmluZykge1xuICBjb25zdCBvYmplY3RzID0gZ2V0Q3JlYXRlZE9iamVjdHModHhSZXMpO1xuICBpZiAoIW9iamVjdHMpIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byBtaW50IGFydHdvcmsgc2hhcmRcIik7XG4gIGNvbnN0IG9iamVjdFdpdGhPd25lckFkZHJlc3MgPSBvYmplY3RzLmZpbmQoKG9iaikgPT4ge1xuICAgIGlmICh0eXBlb2Ygb2JqLm93bmVyID09PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKFwiQWRkcmVzc093bmVyXCIgaW4gb2JqLm93bmVyKSB7XG4gICAgICByZXR1cm4gb2JqLm93bmVyLkFkZHJlc3NPd25lciA9PT0gYWRkcmVzcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIGlmICghb2JqZWN0V2l0aE93bmVyQWRkcmVzcylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRmFpbGVkIHRvIGZpbmQgb2JqZWN0IHdpdGggb3duZXIgYWRkcmVzcyAke2FkZHJlc3N9IGluIG9iamVjdHM6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIG9iamVjdHMsXG4gICAgICAgIG51bGwsXG4gICAgICAgIDJcbiAgICAgICl9YFxuICAgICk7XG4gIGNvbnN0IG9iamVjdElkID0gb2JqZWN0V2l0aE93bmVyQWRkcmVzcy5yZWZlcmVuY2Uub2JqZWN0SWQ7XG4gIHJldHVybiBvYmplY3RJZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPYmplY3RJZEluT3duZWRPYmplY3RMaXN0KFxuICBsaXN0OiBPd25lZE9iamVjdExpc3QsXG4gIG9iamVjdElkOiBzdHJpbmdcbik6IERhdW0gfCBmYWxzZSB7XG4gIGxldCBvYmplY3Q6IERhdW0gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxpc3QuZGF0YS5maW5kKChvYmo6IERhdW0pID0+IHtcbiAgICBpZiAob2JqLmRhdGEub2JqZWN0SWQgPT09IG9iamVjdElkKSB7XG4gICAgICBvYmplY3QgPSBvYmo7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbiAgaWYgKG9iamVjdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBvYmplY3Q7XG59XG4iXX0=