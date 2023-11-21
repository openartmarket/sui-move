export async function mergeContractStock(executor, params) {
    const response = await executor.execute(async (txb, packageId) => {
        for (const { toContractStockId, fromContractStockId } of params) {
            txb.moveCall({
                target: `${packageId}::open_art_market::merge_contract_stocks`,
                arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)],
            });
        }
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=mergeContractStock.js.map