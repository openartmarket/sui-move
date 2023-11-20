import { fromB64 } from "@mysten/bcs";
import type { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { GasStationClient, ShinamiWalletSigner } from "@shinami/clients";
import { buildGaslessTransactionBytes } from "@shinami/clients";

export interface Executor {
  execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => void;

export type SuiExecutorParams = {
  suiClient: SuiClient;
  packageId: string;
  keypair: Keypair;
};

export class SuiExecutor implements Executor {
  constructor(private readonly params: SuiExecutorParams) {}

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const txb = new TransactionBlock();
    const { suiClient, packageId, keypair } = this.params;
    build(txb, packageId);

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

export type ShinamiExecutorParams = {
  suiClient: SuiClient;
  gasClient: GasStationClient;
  packageId: string;
  onBehalfOf: string;
  signer: ShinamiWalletSigner;
};

const SUI_GAS_FEE_LIMIT = 5_000_000;

export class ShinamiExecutor implements Executor {
  constructor(private readonly params: ShinamiExecutorParams) {}

  async execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse> {
    const { suiClient, gasClient, packageId, onBehalfOf, signer } = this.params;
    const gaslessTx = await buildGaslessTransactionBytes({
      sui: suiClient,
      build: async (txb) => build(txb, packageId),
    });

    const { txBytes, signature: gasSignature } = await gasClient.sponsorTransactionBlock(
      gaslessTx,
      onBehalfOf,
      SUI_GAS_FEE_LIMIT,
    );

    // Sign the sponsored tx.
    const { signature } = await signer.signTransactionBlock(fromB64(txBytes));
    // Execute the sponsored & signed tx.
    const response = await suiClient.executeTransactionBlock({
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
