import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { KeyClient, WalletClient } from "@shinami/clients";
import { randomUUID } from "crypto";

import type { MintContractParams } from "../src/mintContract.js";
import { newSuiAddress, type SuiAddress } from "../src/sui.js";
import type { NetworkName } from "../src/types.js";
import type { Wallet } from "../src/Wallet.js";
import { newWallet } from "../src/Wallet.js";

export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

export const PACKAGE_ID = getEnv("PACKAGE_ID");

export async function makeWallet(): Promise<Wallet> {
  if (process.env.SHINAMI_ENABLED) {
    const shinamiAccessKey = getEnv("SHINAMI_ACCESS_KEY");

    const walletClient = new WalletClient(shinamiAccessKey);
    const secret = randomUUID();
    const walletId = randomUUID();
    const keyClient = new KeyClient(shinamiAccessKey);
    const sessionToken = await keyClient.createSession(secret);
    const address = await walletClient.createWallet(walletId, sessionToken);
    return newWallet({
      type: "shinami-sponsored",
      packageId: PACKAGE_ID,
      shinamiAccessKey,
      address,
      secret,
      walletId,
    });
  } else {
    const suiAddress = await newSuiAddress();
    const keypair = Ed25519Keypair.deriveKeypair(suiAddress.phrase);
    const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
    return newWallet({ type: "sui", packageId: PACKAGE_ID, network: SUI_NETWORK, keypair });
  }
}

export async function makeAdminWallet(): Promise<Wallet> {
  if (process.env.SHINAMI_ENABLED) {
    const shinamiAccessKey = getEnv("SHINAMI_ACCESS_KEY");

    return newWallet({
      type: "shinami",
      packageId: PACKAGE_ID,
      shinamiAccessKey,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
    });
  } else {
    const suiAddress: SuiAddress = {
      address: ADMIN_ADDRESS,
      phrase: ADMIN_PHRASE,
    };
    const keypair = Ed25519Keypair.deriveKeypair(suiAddress.phrase);
    const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
    return newWallet({ type: "sui", packageId: PACKAGE_ID, network: SUI_NETWORK, keypair });
  }
}

export const adminWallet = await makeAdminWallet();

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
  productId: "mona-lisa",
};

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
