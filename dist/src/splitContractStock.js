import { getCreatedObjects } from "./getters";
export async function splitContractStock(executor, params) {
    const { contractStockId, quantity } = params;
    const response = await executor.execute((txb, packageId) => {
        txb.moveCall({
            target: `${packageId}::open_art_market::split_contract_stock`,
            arguments: [txb.object(contractStockId), txb.pure(quantity)],
        });
    });
    const { digest } = response;
    const createdObjects = getCreatedObjects(response);
    if (createdObjects.length !== 1) {
        throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
    }
    const createdObject = createdObjects[0];
    const splitContractStockId = createdObject.objectId;
    return { digest, splitContractStockId };
}
//# sourceMappingURL=splitContractStock.js.map