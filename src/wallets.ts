import { fromB64 } from "@mysten/bcs";
import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient, KeyClient, WalletClient } from "@shinami/clients";
import { buildGaslessTransactionBytes, ShinamiWalletSigner } from "@shinami/clients";

import type { BuildTransactionBlock, Wallet } from "./Wallet.js";

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

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const { suiClient, gasStationClient, walletClient, keyClient, packageId, walletId, secret } =
      this.params;

    const signer = new ShinamiWalletSigner(walletId, walletClient, secret, keyClient);

    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: suiClient,
      build: (txb) => build(txb, packageId),
    });

    const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
      gaslessPayloadBase64,
      this.address,
      SUI_GAS_FEE_LIMIT,
    );
    // Sign the sponsored tx.
    const { signature } = await signer.signTransactionBlock(fromB64(sponsoredResponse.txBytes));
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
