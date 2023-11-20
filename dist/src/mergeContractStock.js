export async function mergeContractStock(executor, params) {
    const { toContractStockId, fromContractStockId } = params;
    const response = await executor.execute((txb, packageId) => {
        txb.moveCall({
            target: `${packageId}::open_art_market::merge_contract_stocks`,
            arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)],
        });
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=mergeContractStock.js.map