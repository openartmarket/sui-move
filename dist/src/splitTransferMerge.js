import { getContractStocks } from "./getContractStocks";
import { mergeContractStock } from "./mergeContractStock";
import { splitContractStock } from "./splitContractStock";
import { transferContractStock } from "./transferContractStock";
/**
 * Transfers a quantity of contract stock from one address to another.
 * Takes care of splitting and merging so that aftet the transfer,
 * both addresses have a single stock.
 */
export async function splitTransferMerge({ packageId, fromExecutor, toExecutor, contractId, fromAddress, toAddress, quantity, }) {
    const fromContractStocks = await getContractStocks({
        suiClient: fromExecutor.suiClient,
        owner: fromAddress,
        contractId,
        packageId,
    });
    for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(fromContractStocks)) {
        await mergeContractStock(fromExecutor, [{ fromContractStockId, toContractStockId }]);
    }
    const { splitContractStockId } = await splitContractStock(fromExecutor, {
        contractStockId: fromContractStocks[0].objectId,
        quantity,
    });
    const { digest } = await transferContractStock(fromExecutor, {
        contractId,
        contractStockId: splitContractStockId,
        toAddress,
    });
    const toContractStocks = await getContractStocks({
        suiClient: toExecutor.suiClient,
        owner: toAddress,
        contractId,
        packageId,
    });
    for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(toContractStocks)) {
        await mergeContractStock(toExecutor, [{ fromContractStockId, toContractStockId }]);
    }
    return {
        digest,
        fromContractStockId: fromContractStocks[0].objectId,
        toContractStockId: toContractStocks[0].objectId,
    };
}
function makeMergeContractStockParams(contractStocks) {
    const stocksToMerge = contractStocks.slice(1);
    return stocksToMerge.map((stock) => ({
        fromContractStockId: stock.objectId,
        toContractStockId: contractStocks[0].objectId,
    }));
}
//# sourceMappingURL=splitTransferMerge.js.map