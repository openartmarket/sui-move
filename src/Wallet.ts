import type { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import type { TransactionBlock } from "@mysten/sui.js/transactions";
import { createSuiClient, GasStationClient } from "@shinami/clients";

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
  packageId: string;
  keypair: Keypair;
  network: NetworkName;
};

export type NewShinamiWalletParams = {
  type: "shinami";
  packageId: string;
  keypair: Keypair;
  shinamiAccessKey: string;
  isAdmin: boolean;
};

export async function newWallet(params: NewWalletParams): Promise<Wallet> {
  switch (params.type) {
    case "sui": {
      const { network, packageId, keypair } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });
      return new SuiWallet({
        packageId,
        suiClient,
        keypair,
      });
    }
    case "shinami": {
      const { packageId, shinamiAccessKey, keypair, isAdmin } = params;
      const suiClient = createSuiClient(shinamiAccessKey);
      const gasClient = new GasStationClient(shinamiAccessKey);

      return new ShinamiWallet({
        suiClient,
        gasStationClient: gasClient,
        packageId,
        keypair,
        isAdmin,
      });
    }
  }
}
