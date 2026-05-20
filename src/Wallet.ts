import type { Keypair } from "@mysten/sui/cryptography";
import type {
	SuiObjectRef,
	SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import type { Transaction } from "@mysten/sui/transactions";

import type { Address, PackageId } from "./brands.js";
import { toAddress } from "./brands.js";
import type { NetworkName } from "./types.js";
import { SponsoredWallet, SuiWallet } from "./wallets.js";

export type ReadonlyWallet = {
	readonly address: Address;
	readonly suiClient: SuiJsonRpcClient;
	readonly packageId: PackageId;
};

export interface Wallet extends ReadonlyWallet {
	execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse>;
}

export type BuildTransaction = (
	txb: Transaction,
	packageId: PackageId,
) => Promise<void>;

export type SponsoredSubmitRequest = {
	transactionBytes: Uint8Array;
	senderSignature: string;
	senderAddress: Address;
};

export type SponsoredSubmit = (
	req: SponsoredSubmitRequest,
) => Promise<SuiTransactionBlockResponse>;

export type NewWalletParams = NewSuiWalletParams | NewSponsoredWalletParams;

export type NewSuiWalletParams = {
	type: "sui";
	packageId: PackageId;
	network: NetworkName;
	keypair: Keypair;
};

export type NewSponsoredWalletParams = {
	type: "sponsored";
	packageId: PackageId;
	network: NetworkName;
	senderKeypair: Keypair;
	sponsorAddress: Address;
	reserveGasCoins: () => Promise<SuiObjectRef[]>;
	submit: SponsoredSubmit;
};

export function newWallet(params: NewWalletParams): Wallet {
	switch (params.type) {
		case "sui": {
			const { network, packageId, keypair } = params;
			const url = getJsonRpcFullnodeUrl(network);
			const suiClient = new SuiJsonRpcClient({ url, network });
			return new SuiWallet({
				packageId,
				suiClient,
				keypair,
			});
		}
		case "sponsored": {
			const {
				network,
				packageId,
				senderKeypair,
				sponsorAddress,
				reserveGasCoins,
				submit,
			} = params;
			const url = getJsonRpcFullnodeUrl(network);
			const suiClient = new SuiJsonRpcClient({ url, network });
			return new SponsoredWallet({
				packageId,
				suiClient,
				senderKeypair,
				sponsorAddress,
				reserveGasCoins,
				submit,
			});
		}
	}
}

// Re-export so callers building a Wallet from a raw keypair can brand its
// address without importing brands.ts directly.
export { toAddress };
