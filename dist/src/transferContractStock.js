export async function transferContractStock(executor, params) {
    const { contractId, contractStockId, receiverAddress } = params;
    const response = await executor.execute((txb, packageId) => {
        txb.moveCall({
            target: `${packageId}::open_art_market::transfer_contract_stock`,
            arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(receiverAddress)],
        });
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=transferContractStock.js.map