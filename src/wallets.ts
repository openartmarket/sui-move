import type { Keypair } from "@mysten/sui/cryptography";
import type {
	SuiJsonRpcClient,
	SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";

import type { BuildTransaction, SponsoredSubmit, Wallet } from "./Wallet.js";

export type SuiWalletParams = {
	suiClient: SuiJsonRpcClient;
	packageId: string;
	keypair: Keypair;
};

export class SuiWallet implements Wallet {
	constructor(private readonly params: SuiWalletParams) {}

	get address(): string {
		return this.params.keypair.toSuiAddress();
	}

	get suiClient(): SuiJsonRpcClient {
		return this.params.suiClient;
	}

	get packageId(): string {
		return this.params.packageId;
	}

	async execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse> {
		const txn = new Transaction();
		const { suiClient, packageId, keypair } = this.params;
		await build(txn, packageId);

		const response = await suiClient.signAndExecuteTransaction({
			signer: keypair,
			transaction: txn,
			options: {
				showObjectChanges: true,
				showEffects: true,
			},
		});
		await suiClient.waitForTransaction({ digest: response.digest });

		return checkResponse(response);
	}
}

export type SponsoredWalletParams = {
	suiClient: SuiJsonRpcClient;
	packageId: string;
	senderKeypair: Keypair;
	sponsorAddress: string;
	reserveGasCoins: () => Promise<
		{ objectId: string; version: string; digest: string }[]
	>;
	submit: SponsoredSubmit;
};

export class SponsoredWallet implements Wallet {
	constructor(private readonly params: SponsoredWalletParams) {}

	get address(): string {
		return this.params.senderKeypair.toSuiAddress();
	}

	get suiClient(): SuiJsonRpcClient {
		return this.params.suiClient;
	}

	get packageId(): string {
		return this.params.packageId;
	}

	async execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse> {
		const {
			suiClient,
			packageId,
			senderKeypair,
			sponsorAddress,
			reserveGasCoins,
			submit,
		} = this.params;
		const senderAddress = senderKeypair.toSuiAddress();

		const tx = new Transaction();
		await build(tx, packageId);
		tx.setSender(senderAddress);
		tx.setGasOwner(sponsorAddress);
		const gasCoins = await reserveGasCoins();
		tx.setGasPayment(gasCoins);

		const transactionBytes = await tx.build({ client: suiClient });
		const { signature: senderSignature } =
			await senderKeypair.signTransaction(transactionBytes);

		const response = await submit({
			transactionBytes,
			senderSignature,
			senderAddress,
		});
		await suiClient.waitForTransaction({ digest: response.digest });
		return checkResponse(response);
	}
}

function checkResponse(
	response: SuiTransactionBlockResponse,
): SuiTransactionBlockResponse {
	const { effects } = response;
	if (!effects) {
		throw new Error("Failed to get execution effects");
	}
	const { status } = effects;
	if (status.error) {
		throw new Error(status.error);
	}
	if (status.status !== "success") {
		throw new Error(`Transaction failed with status: ${status}`);
	}
	return response;
}
