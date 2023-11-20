import { fromB64 } from "@mysten/bcs";
import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/dist/cjs/client";
import type { Keypair } from "@mysten/sui.js/dist/cjs/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient, ShinamiWalletSigner } from "@shinami/clients";
import { buildGaslessTransactionBytes } from "@shinami/clients";

export interface Executor {
  readonly client: SuiClient;
  execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => void;

export type SuiExecutorParams = {
  client: SuiClient;
  packageId: string;
  signerPhrase: string;
};

export class SuiExecutor implements Executor {
  public readonly client: SuiClient;

  private readonly packageId: string;
  private readonly keypair: Keypair;

  constructor({ client, packageId, signerPhrase }: SuiExecutorParams) {
    this.client = client;
    this.packageId = packageId;
    this.keypair = Ed25519Keypair.deriveKeypair(signerPhrase);
  }

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const txb = new TransactionBlock();
    build(txb, this.packageId);

    const response = await this.client.signAndExecuteTransactionBlock({
      signer: this.keypair,
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

export type ShinamiExecutorParams = {
  client: SuiClient;
  gasClient: GasStationClient;
  packageId: string;
  onBehalfOf: string;
  signer: ShinamiWalletSigner;
};

const SUI_GAS_FEE_LIMIT = 5_000_000;

export class ShinamiExecutor implements Executor {
  public readonly client: SuiClient;
  private readonly gasClient: GasStationClient;
  private readonly onBehalfOf: string;
  private readonly packageId: string;
  private readonly signer: ShinamiWalletSigner;

  constructor({ client, gasClient, packageId, onBehalfOf, signer }: ShinamiExecutorParams) {
    this.client = client;
    this.gasClient = gasClient;
    this.packageId = packageId;
    this.onBehalfOf = onBehalfOf;
    this.signer = signer;
  }

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const gaslessTx = await buildGaslessTransactionBytes({
      sui: this.client,
      build: async (txb) => build(txb, this.packageId),
    });

    const { txBytes, signature: gasSignature } = await this.gasClient.sponsorTransactionBlock(
      gaslessTx,
      this.onBehalfOf,
      SUI_GAS_FEE_LIMIT,
    );

    // Sign the sponsored tx.
    const { signature } = await this.signer.signTransactionBlock(fromB64(txBytes));
    // Execute the sponsored & signed tx.
    const response = await this.client.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: [signature, gasSignature],
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
