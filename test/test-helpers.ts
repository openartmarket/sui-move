import { randomUUID } from "node:crypto";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
	toAddress,
	toAdminCapId,
	toAssetKind,
	toPackageId,
	toPhrase,
} from "../src/brands.js";
import { newSuiAddress } from "../src/helpers.js";
import type { MintAssetParams } from "../src/mintAsset.js";
import type { NetworkName } from "../src/types.js";
import type { Wallet } from "../src/Wallet.js";
import { newWallet } from "../src/Wallet.js";

export const ADMIN_CAP_ID = toAdminCapId(getEnv("ADMIN_CAP_ID"));
export const ADMIN_ADDRESS = toAddress(getEnv("ADMIN_ADDRESS"));
export const ADMIN_PHRASE = toPhrase(getEnv("ADMIN_PHRASE"));

export const PACKAGE_ID = toPackageId(getEnv("PACKAGE_ID"));

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

export function makeMintAssetOptions(
	overrides: Partial<MintAssetParams> = {},
): MintAssetParams {
	return {
		adminCapId: ADMIN_CAP_ID,
		kind: toAssetKind("painting"),
		totalShareCount: 500,
		sharePrice: 10,
		outgoingPrice: 100,
		name: "Mona Lisa",
		description: "A painting",
		currency: "USD",
		reference: `mona-lisa-${randomUUID()}`,
		metadata: {
			artist: "Leonardo da Vinci",
			creation_date: "1503-1519",
		},
		...overrides,
	};
}

export function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing env variable ${name}`);
	return value;
}
