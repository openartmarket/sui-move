import { randomUUID } from "node:crypto";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { newSuiAddress } from "../src/helpers.js";
import type { MintContractParams } from "../src/mintContract.js";
import type { NetworkName } from "../src/types.js";
import type { Wallet } from "../src/Wallet.js";
import { newWallet } from "../src/Wallet.js";

export const ADMIN_CAP_ID = getEnv("ADMIN_CAP_ID");
export const ADMIN_ADDRESS = getEnv("ADMIN_ADDRESS");
export const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

export const PACKAGE_ID = getEnv("PACKAGE_ID");

export async function makeWallet(): Promise<Wallet> {
	const suiAddress = await newSuiAddress();
	const keypair = Ed25519Keypair.deriveKeypair(suiAddress.phrase);
	const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
	return newWallet({
		type: "sui",
		packageId: PACKAGE_ID,
		network: SUI_NETWORK,
		keypair,
	});
}

export async function makeAdminWallet(): Promise<Wallet> {
	const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
	const SUI_NETWORK = getEnv("SUI_NETWORK") as NetworkName;
	return newWallet({
		type: "sui",
		packageId: PACKAGE_ID,
		network: SUI_NETWORK,
		keypair,
	});
}

export const adminWallet = await makeAdminWallet();

export function makeMintContractOptions(): MintContractParams {
	return {
		adminCapId: ADMIN_CAP_ID,
		totalShareCount: 500,
		sharePrice: 10,
		outgoingPrice: 100,
		creationTimestampMillis: 1685548680595,
		name: "Mona Lisa",
		artist: "Leonardo da Vinci",
		description: "Choconta painting",
		currency: "USD",
		productId: `mona-lisa-${randomUUID()}`,
	};
}

export function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing env variable ${name}`);
	return value;
}
