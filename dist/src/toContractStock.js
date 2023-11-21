import { getIntField, getParsedData, getStringField } from "./getters";
export function toContractStock(objectData) {
    const parsedData = getParsedData(objectData);
    return {
        contractStockId: objectData.objectId,
        digest: objectData.digest,
        contractId: getStringField(parsedData, "contract_id"),
        quantity: getIntField(parsedData, "shares"),
        productId: getStringField(parsedData, "reference"),
    };
}
//# sourceMappingURL=toContractStock.js.map