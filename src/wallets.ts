import { fromBase64 } from "@mysten/bcs";
import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import type { Keypair } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import type { GasStationClient, KeyClient, WalletClient } from "@shinami/clients/sui";
import { buildGaslessTransaction, ShinamiWalletSigner } from "@shinami/clients/sui";

import type { BuildTransaction, Wallet } from "./Wallet.js";

export type SuiWalletParams = {
  suiClient: SuiClient;
  packageId: string;
  keypair: Keypair;
};

export class SuiWallet implements Wallet {
  constructor(private readonly params: SuiWalletParams) {}

  get address(): string {
    return this.params.keypair.toSuiAddress();
  }

  get suiClient(): SuiClient {
    return this.params.suiClient;
  }

  async execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse> {
    const txn = new Transaction();
    const { suiClient, packageId, keypair } = this.params;
    await build(txn, packageId);

    const response = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: txn,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    return checkResponse(response);
  }
}

export type ShinamiWalletParams = {
  suiClient: SuiClient;
  gasStationClient: GasStationClient;
  walletClient: WalletClient;
  keyClient: KeyClient;
  packageId: string;
  address: string;
  walletId: string;
  secret: string;
};

const SUI_GAS_FEE_LIMIT = 5_000_000;

export class ShinamiWallet implements Wallet {
  constructor(private readonly params: ShinamiWalletParams) {}

  get suiClient(): SuiClient {
    return this.params.suiClient;
  }

  get address(): string {
    return this.params.address;
  }

  async execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse> {
    const { suiClient, gasStationClient, walletClient, keyClient, packageId, walletId, secret } =
      this.params;

    const signer = new ShinamiWalletSigner(walletId, walletClient, secret, keyClient);

    const gaslessTxn = await buildGaslessTransaction((txb) => build(txb, packageId), {
      sui: suiClient,
    });

    const sponsoredResponse = await gasStationClient.sponsorTransaction({
      gasBudget: SUI_GAS_FEE_LIMIT,
      txKind: gaslessTxn.txKind,
      sender: this.address,
    });
    // Sign the sponsored tx.
    const { signature } = await signer.signTransaction(fromBase64(sponsoredResponse.txBytes));
    const response = await suiClient.executeTransactionBlock({
      transactionBlock: sponsoredResponse.txBytes,
      signature: [signature, sponsoredResponse.signature],
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });
    return checkResponse(response);
  }
}

function checkResponse(response: SuiTransactionBlockResponse): SuiTransactionBlockResponse {
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
