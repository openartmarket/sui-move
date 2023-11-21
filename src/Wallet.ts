import type { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import type { TransactionBlock } from "@mysten/sui.js/transactions";
import { createSuiClient, GasStationClient } from "@shinami/clients";

import type { SuiAddress } from "./sui.js";
import type { NetworkName } from "./types.js";
import { ShinamiWallet, SuiWallet } from "./wallets.js";

export interface Wallet {
  readonly address: string;
  readonly suiClient: SuiClient;
  execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

export type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;

export type NewWalletParams = NewSuiWalletParams | NewShinamiWalletParams;

export type NewSuiWalletParams = {
  type: "sui";
  network: NetworkName;
  packageId: string;
  suiAddress: SuiAddress;
};

export type NewShinamiWalletParams = {
  type: "shinami";
  network: NetworkName;
  packageId: string;
  shinamiAccessKey: string;
  address: string;
};

export async function newWallet(params: NewWalletParams): Promise<Wallet> {
  switch (params.type) {
    case "sui": {
      const { network, packageId, suiAddress } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });
      const { address, phrase } = suiAddress;
      const keypair = Ed25519Keypair.deriveKeypair(phrase);
      return new SuiWallet({
        address,
        packageId,
        suiClient,
        keypair,
      });
    }
    case "shinami": {
      const { packageId, shinamiAccessKey, address } = params;
      const suiClient = createSuiClient(shinamiAccessKey);
      const gasClient = new GasStationClient(shinamiAccessKey);
      const keypair = new Ed25519Keypair();

      return new ShinamiWallet({
        suiClient,
        gasStationClient: gasClient,
        packageId,
        address,
        keypair,
      });
    }
  }
}
