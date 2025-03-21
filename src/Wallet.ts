import type { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import type { Keypair } from "@mysten/sui.js/cryptography";
import type { TransactionBlock } from "@mysten/sui.js/transactions";
import { GasStationClient, KeyClient, WalletClient, createSuiClient } from "@shinami/clients";

import type { NetworkName } from "./types.js";
import { ShinamiWallet, SuiWallet } from "./wallets.js";

export type ReadonlyWallet = {
  readonly address: string;
  readonly suiClient: SuiClient;
  readonly packageId: string;
};

export interface Wallet extends ReadonlyWallet {
  execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

export type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;

export type NewWalletParams =
  | NewSuiWalletParams
  | NewShinamiWalletParams
  | NewShinamiSponsoredWalletParams;

export type NewSuiWalletParams = {
  type: "sui";
  packageId: string;
  network: NetworkName;
  keypair: Keypair;
};

export type NewShinamiWalletParams = {
  type: "shinami";
  packageId: string;
  shinamiAccessKey: string;
  keypair: Keypair;
};

export type NewShinamiSponsoredWalletParams = {
  type: "shinami-sponsored";
  packageId: string;
  shinamiAccessKey: string;
  address: string;
  walletId: string;
  secret: string;
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
      const { packageId, shinamiAccessKey, keypair } = params;
      const suiClient = createSuiClient(shinamiAccessKey);

      return new SuiWallet({
        packageId,
        suiClient,
        keypair,
      });
    }
    case "shinami-sponsored": {
      const { packageId, shinamiAccessKey, address, walletId, secret } = params;
      const suiClient = createSuiClient(shinamiAccessKey);

      const gasClient = new GasStationClient(shinamiAccessKey);
      const keyClient = new KeyClient(shinamiAccessKey);
      const walletClient = new WalletClient(shinamiAccessKey);

      return new ShinamiWallet({
        suiClient,
        gasStationClient: gasClient,
        keyClient,
        walletClient,
        packageId,
        address,
        walletId,
        secret,
      });
    }
  }
}
