import { getIntField, getObjectData, getParsedData } from "./getters.js";
export async function getAvailableStock(client, contractId) {
    const response = await client.getObject({
        id: contractId,
        options: { showContent: true },
    });
    const objectData = getObjectData(response);
    const parsedData = getParsedData(objectData);
    return getIntField(parsedData, "shares");
}
//# sourceMappingURL=getAvailableStock.js.map