import { makeExecutor } from "./executors";
import { newSuiAddress } from "./sui";
export async function newWallet({ packageId, network }) {
    const suiAddress = await newSuiAddress();
    return new SuiWallet({ suiAddress, packageId, network });
}
class SuiWallet {
    address;
    executor;
    constructor({ suiAddress, packageId, network }) {
        this.address = suiAddress.address;
        this.executor = makeExecutor({
            type: "sui",
            phrase: suiAddress.phrase,
            network,
            packageId,
        });
    }
}
//# sourceMappingURL=wallet.js.map