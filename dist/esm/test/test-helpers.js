import { JsonRpcProvider, localnetConnection, } from "@mysten/sui.js";
import { getEnv } from "../src/config";
const provider = new JsonRpcProvider(localnetConnection);
export async function getObject(objectId) {
    return await provider.getObject({
        id: objectId,
        options: { showContent: true },
    });
}
export async function getOwnedObjects(address) {
    return await provider.getOwnedObjects({
        owner: address,
    });
}
export const PUBLISHER_ID = getEnv("PUBLISHER_ID");
export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");
export const USER1_PHRASE = getEnv("USER1_PHRASE");
export const USER2_PHRASE = getEnv("USER2_PHRASE");
export const USER3_PHRASE = getEnv("USER3_PHRASE");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const USER1_ADDRESS = getEnv("USER1_ADDRESS");
export const USER2_ADDRESS = getEnv("USER2_ADDRESS");
export const USER3_ADDRESS = getEnv("USER3_ADDRESS");
export const SUI_NETWORK = getEnv("SUI_NETWORK");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC90ZXN0LWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGVBQWUsRUFDZixrQkFBa0IsR0FHbkIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE1BQU0sUUFBUSxHQUFvQixJQUFJLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTFFLE1BQU0sQ0FBQyxLQUFLLFVBQVUsU0FBUyxDQUFDLFFBQWdCO0lBQzlDLE9BQU8sTUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQzlCLEVBQUUsRUFBRSxRQUFRO1FBQ1osT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtLQUMvQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxlQUFlLENBQUMsT0FBZTtJQUNuRCxPQUFPLE1BQU0sUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUNwQyxLQUFLLEVBQUUsT0FBTztLQUNmLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNyRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBKc29uUnBjUHJvdmlkZXIsXG4gIGxvY2FsbmV0Q29ubmVjdGlvbixcbiAgUGFnaW5hdGVkT2JqZWN0c1Jlc3BvbnNlLFxuICBTdWlPYmplY3RSZXNwb25zZSxcbn0gZnJvbSBcIkBteXN0ZW4vc3VpLmpzXCI7XG5cbmltcG9ydCB7IGdldEVudiB9IGZyb20gXCIuLi9zcmMvY29uZmlnXCI7XG5jb25zdCBwcm92aWRlcjogSnNvblJwY1Byb3ZpZGVyID0gbmV3IEpzb25ScGNQcm92aWRlcihsb2NhbG5ldENvbm5lY3Rpb24pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0T2JqZWN0KG9iamVjdElkOiBzdHJpbmcpOiBQcm9taXNlPFN1aU9iamVjdFJlc3BvbnNlPiB7XG4gIHJldHVybiBhd2FpdCBwcm92aWRlci5nZXRPYmplY3Qoe1xuICAgIGlkOiBvYmplY3RJZCxcbiAgICBvcHRpb25zOiB7IHNob3dDb250ZW50OiB0cnVlIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0T3duZWRPYmplY3RzKGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8UGFnaW5hdGVkT2JqZWN0c1Jlc3BvbnNlPiB7XG4gIHJldHVybiBhd2FpdCBwcm92aWRlci5nZXRPd25lZE9iamVjdHMoe1xuICAgIG93bmVyOiBhZGRyZXNzLFxuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IFBVQkxJU0hFUl9JRCA9IGdldEVudihcIlBVQkxJU0hFUl9JRFwiKTtcbmV4cG9ydCBjb25zdCBBRE1JTl9DQVBfSUQgPSBnZXRFbnYoXCJBRE1JTl9DQVBfSURcIik7XG5leHBvcnQgY29uc3QgQURNSU5fUEhSQVNFID0gZ2V0RW52KFwiQURNSU5fUEhSQVNFXCIpO1xuZXhwb3J0IGNvbnN0IFVTRVIxX1BIUkFTRSA9IGdldEVudihcIlVTRVIxX1BIUkFTRVwiKTtcbmV4cG9ydCBjb25zdCBVU0VSMl9QSFJBU0UgPSBnZXRFbnYoXCJVU0VSMl9QSFJBU0VcIik7XG5leHBvcnQgY29uc3QgVVNFUjNfUEhSQVNFID0gZ2V0RW52KFwiVVNFUjNfUEhSQVNFXCIpO1xuZXhwb3J0IGNvbnN0IEFETUlOX0FERFJFU1MgPSBnZXRFbnYoXCJBRE1JTl9BRERSRVNTXCIpO1xuZXhwb3J0IGNvbnN0IFVTRVIxX0FERFJFU1MgPSBnZXRFbnYoXCJVU0VSMV9BRERSRVNTXCIpO1xuZXhwb3J0IGNvbnN0IFVTRVIyX0FERFJFU1MgPSBnZXRFbnYoXCJVU0VSMl9BRERSRVNTXCIpO1xuZXhwb3J0IGNvbnN0IFVTRVIzX0FERFJFU1MgPSBnZXRFbnYoXCJVU0VSM19BRERSRVNTXCIpO1xuZXhwb3J0IGNvbnN0IFNVSV9ORVRXT1JLID0gZ2V0RW52KFwiU1VJX05FVFdPUktcIik7XG4iXX0=