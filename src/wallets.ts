import { fromB64 } from "@mysten/bcs";
import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient, ShinamiWalletSigner } from "@shinami/clients";
import { buildGaslessTransactionBytes } from "@shinami/clients";

import type { BuildTransactionBlock, Wallet } from "./newWallet.js";

export type SuiWalletParams = {
  address: string;
  suiClient: SuiClient;
  packageId: string;
  keypair: Keypair;
};

export class SuiWallet implements Wallet {
  constructor(private readonly params: SuiWalletParams) {}

  get address(): string {
    throw new Error("Not implemented");
  }

  get suiClient(): SuiClient {
    return this.params.suiClient;
  }

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const txb = new TransactionBlock();
    const { suiClient, packageId, keypair } = this.params;
    await build(txb, packageId);

    const response = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
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
  gasClient: GasStationClient;
  packageId: string;
  address: string;
  signer: ShinamiWalletSigner;
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

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const { suiClient, gasClient, packageId, address, signer } = this.params;
    const gaslessTx = await buildGaslessTransactionBytes({
      sui: suiClient,
      build: (txb) => build(txb, packageId),
    });

    const { txBytes, signature: gasSignature } = await gasClient.sponsorTransactionBlock(
      gaslessTx,
      address,
      SUI_GAS_FEE_LIMIT,
    );

    // Sign the sponsored tx.
    const { signature } = await signer.signTransactionBlock(fromB64(txBytes));

    const signatures = [signature, gasSignature];
    // Execute the sponsored & signed tx.
    const response = await suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: signatures,
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
