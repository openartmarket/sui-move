import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/dist/cjs/client";
import type { Keypair } from "@mysten/sui.js/dist/cjs/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export interface Executor {
  readonly client: SuiClient;
  readonly address: string;

  execute(
    build: (txb: TransactionBlock, packageId: string) => void,
  ): Promise<SuiTransactionBlockResponse>;
}

export type SuiExecutorParams = {
  client: SuiClient;
  packageId: string;
  signerPhrase: string;
};

export class SuiExecutor implements Executor {
  public readonly client: SuiClient;
  public readonly address: string;

  private readonly packageId: string;
  private readonly keypair: Keypair;

  constructor({ client, packageId, signerPhrase }: SuiExecutorParams) {
    this.client = client;
    this.packageId = packageId;
    this.keypair = Ed25519Keypair.deriveKeypair(signerPhrase);
    this.address = this.keypair.getPublicKey().toSuiAddress();
  }

  async execute(
    build: (txb: TransactionBlock, packageId: string) => void,
  ): Promise<SuiTransactionBlockResponse> {
    const txb = new TransactionBlock();
    build(txb, this.packageId);

    const txRes = await this.client.signAndExecuteTransactionBlock({
      signer: this.keypair,
      transactionBlock: txb,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    const { effects } = txRes;
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
    return txRes;
  }
}
