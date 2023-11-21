import { getObjectData, getParsedData, getStringField, getType } from "./getters";
/**
 * Returns all contract stocks of a contract owned by an address.
 */
export async function getContractStocks(params) {
    const { suiClient, owner, contractId, packageId, cursor } = params;
    const type = `${packageId}::open_art_market::ContractStock`;
    const response = await suiClient.getOwnedObjects({
        owner,
        options: {
            showContent: true,
        },
        cursor,
    });
    const data = response.data.map(getObjectData).filter((object) => {
        const parsedData = getParsedData(object);
        return getType(parsedData) === type && getStringField(parsedData, "contract_id") === contractId;
    });
    if (response.hasNextPage && response.nextCursor) {
        const nextData = await getContractStocks({
            ...params,
            cursor: response.nextCursor,
        });
        return [...data, ...nextData];
    }
    return data;
}
//# sourceMappingURL=getContractStocks.js.map