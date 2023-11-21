import type { MintContractParams, SuiAddress } from "../src";
import { getIntField, getObjectData, getParsedData } from "../src/getters.js";
import type { NetworkName } from "../src/types";
import type { Wallet } from "../src/wallet";
import { newWallet } from "../src/wallet.js";

export const PUBLISHER_ID = getEnv("PUBLISHER_ID");
export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
export const PACKAGE_ID = getEnv("PACKAGE_ID");

export function makeWallet(admin = false): Promise<Wallet> {
  if (process.env.USE_SHINAMI) {
    const address = admin ? ADMIN_ADDRESS : undefined;
    return newWallet({
      type: "shinami",
      packageId: PACKAGE_ID,
      network: SUI_NETWORK,
      shinamiAccessKey: getEnv("SHINAMI_ACCESS_KEY"),
      walletId: getEnv("SHINAMI_WALLET_ID"),
      walletSecret: getEnv("SHINAMI_WALLET_SECRET"),
      address,
    });
  } else {
    const suiAddress: SuiAddress | undefined = admin
      ? {
          address: ADMIN_ADDRESS,
          phrase: ADMIN_PHRASE,
        }
      : undefined;
    return newWallet({ type: "sui", packageId: PACKAGE_ID, network: SUI_NETWORK, suiAddress });
  }
}

export const adminWallet = await makeWallet(true);

export const mintContractOptions: MintContractParams = {
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
export async function getQuantity(wallet: Wallet, id: string): Promise<number> {
  const { suiClient } = wallet.executor;
  const response = await suiClient.getObject({
    id,
    options: { showContent: true },
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
