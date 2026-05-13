import type { Keypair } from "@mysten/sui/cryptography";
import type {
	SuiObjectRef,
	SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import type { Transaction } from "@mysten/sui/transactions";

import type { NetworkName } from "./types.js";
import { SponsoredWallet, SuiWallet } from "./wallets.js";

export type ReadonlyWallet = {
	readonly address: string;
	readonly suiClient: SuiJsonRpcClient;
	readonly packageId: string;
};

export interface Wallet extends ReadonlyWallet {
	execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse>;
}

export type BuildTransaction = (
	txb: Transaction,
	packageId: string,
) => Promise<void>;

export type SponsoredSubmitRequest = {
	transactionBytes: Uint8Array;
	senderSignature: string;
	senderAddress: string;
};

export type SponsoredSubmit = (
	req: SponsoredSubmitRequest,
) => Promise<SuiTransactionBlockResponse>;

export type NewWalletParams = NewSuiWalletParams | NewSponsoredWalletParams;

export type NewSuiWalletParams = {
	type: "sui";
	packageId: string;
	network: NetworkName;
	keypair: Keypair;
};

export type NewSponsoredWalletParams = {
	type: "sponsored";
	packageId: string;
	network: NetworkName;
	senderKeypair: Keypair;
	sponsorAddress: string;
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
