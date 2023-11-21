import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient } from "@shinami/clients";
import { buildGaslessTransactionBytes } from "@shinami/clients";

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
  packageId: string;
  keypair: Keypair;
  isAdmin: boolean;
};

const SUI_GAS_FEE_LIMIT = 5_000_000;

export class ShinamiWallet implements Wallet {
  constructor(private readonly params: ShinamiWalletParams) {}

  get suiClient(): SuiClient {
    return this.params.suiClient;
  }

  get address(): string {
    return this.params.keypair.toSuiAddress();
  }

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const { suiClient, gasStationClient, packageId, keypair, isAdmin } = this.params;
    let response: SuiTransactionBlockResponse;

    if (!isAdmin) {
      const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
        sui: suiClient,
        build: (txb) => build(txb, packageId),
      });

      const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
        gaslessPayloadBase64,
        this.address,
        SUI_GAS_FEE_LIMIT,
      );
      console.log("Transaction Digest:", sponsoredResponse.txDigest);
      const senderSig = await TransactionBlock.from(sponsoredResponse.txBytes).sign({
        signer: keypair,
      });
      response = await suiClient.executeTransactionBlock({
        transactionBlock: sponsoredResponse.txBytes,
        signature: [senderSig.signature, sponsoredResponse.signature],
        requestType: "WaitForLocalExecution",
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      });
    } else {
      const tx = new TransactionBlock();
      await build(tx, packageId);
      response = await suiClient.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: keypair,
        requestType: "WaitForLocalExecution",
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      });
    }
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
