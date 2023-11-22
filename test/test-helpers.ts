import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { KeyClient, WalletClient } from "@shinami/clients";
import { randomUUID } from "crypto";

import { getIntField, getObjectData, getParsedData } from "../src/getters.js";
import type { MintContractParams } from "../src/mintContract.js";
import { newSuiAddress, type SuiAddress } from "../src/sui.js";
import type { NetworkName } from "../src/types.js";
import type { Wallet } from "../src/Wallet.js";
import { newWallet } from "../src/Wallet.js";

export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

export const PACKAGE_ID = getEnv("PACKAGE_ID");

export async function makeWallet(isAdmin = false): Promise<Wallet> {
  if (process.env.SHINAMI_ENABLED) {
    const shinamiAccessKey = getEnv("SHINAMI_ACCESS_KEY");

    const walletClient = new WalletClient(shinamiAccessKey);
    const keyClient = new KeyClient(shinamiAccessKey);
    const walletId = randomUUID();
    let address: string;
    let secret: string;
    if (isAdmin) {
      address = ADMIN_ADDRESS;
      secret = ADMIN_PHRASE;
    } else {
      secret = randomUUID();
      const sessionToken = await keyClient.createSession(secret);
      address = isAdmin ? ADMIN_ADDRESS : await walletClient.createWallet(walletId, sessionToken);
    }

    return newWallet({
      type: "shinami",
      packageId: PACKAGE_ID,
      shinamiAccessKey,
      address,
      secret,
      walletId,
      isAdmin,
    });
  } else {
    let suiAddress: SuiAddress;
    if (isAdmin) {
      suiAddress = {
        address: ADMIN_ADDRESS,
        phrase: getEnv("ADMIN_PHRASE"),
      };
    } else {
      suiAddress = await newSuiAddress();
    }
    const keypair = Ed25519Keypair.deriveKeypair(suiAddress.phrase);
    const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
    return newWallet({ type: "sui", packageId: PACKAGE_ID, network: SUI_NETWORK, keypair });
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
  const { suiClient } = wallet;
  const response = await suiClient.getObject({
    id,
    options: { showContent: true },
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
