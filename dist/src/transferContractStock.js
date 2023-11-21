export async function transferContractStock(executor, params) {
    const response = await executor.execute(async (txb, packageId) => {
        const { contractId, contractStockId, toAddress } = params;
        txb.moveCall({
            target: `${packageId}::open_art_market::transfer_contract_stock`,
            arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(toAddress)],
        });
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=transferContractStock.js.map