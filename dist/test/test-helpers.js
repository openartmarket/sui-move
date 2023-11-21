import { makeExecutor } from "../src/executors.js";
import { getIntField, getObjectData, getParsedData } from "../src/getters.js";
import { newWallet } from "../src/wallet";
export const PUBLISHER_ID = getEnv("PUBLISHER_ID");
export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");
const SUI_NETWORK = getEnv("SUI_NETWORK");
export const PACKAGE_ID = getEnv("PACKAGE_ID");
export const adminExecutor = makeExecutor(makeExecutorOptions(ADMIN_PHRASE));
export function makeWallet() {
    return newWallet({ packageId: PACKAGE_ID, network: SUI_NETWORK });
}
export const mintContractOptions = {
    adminCapId: ADMIN_CAP_ID,
    totalShareCount: 500,
    sharePrice: 10,
    outgoingPrice: 100,
    creationTimestampMillis: 1685548680595,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    description: "Choconta painting",
    currency: "USD",
    image: "reference-id-for-contract",
};
/**
 * Get the quantity of a contract or a contract stock.
 */
export async function getQuantity(wallet, id) {
    const { suiClient } = wallet.executor;
    const response = await suiClient.getObject({
        id,
        options: { showContent: true },
    });
    const objectData = getObjectData(response);
    const parsedData = getParsedData(objectData);
    return getIntField(parsedData, "shares");
}
function getEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing env variable ${name}`);
    return value;
}
function makeExecutorOptions(phrase) {
    if (process.env.USE_SHINAMI) {
        return {
            type: "shinami",
            packageId: PACKAGE_ID,
            network: SUI_NETWORK,
            shinamiAccessKey: getEnv("SHINAMI_ACCESS_KEY"),
            onBehalfOf: "FIXME",
            walletId: getEnv("SHINAMI_WALLET_ID"),
            secret: getEnv("SHINAMI_WALLET_SECRET"),
        };
    }
    else {
        return {
            type: "sui",
            packageId: PACKAGE_ID,
            network: SUI_NETWORK,
            phrase,
        };
    }
}
//# sourceMappingURL=test-helpers.js.map