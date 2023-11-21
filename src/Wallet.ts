import type { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import type { TransactionBlock } from "@mysten/sui.js/transactions";
import { GasStationClient, KeyClient, ShinamiWalletSigner, WalletClient } from "@shinami/clients";

import type { SuiAddress } from "./sui.js";
import { newSuiAddress } from "./sui.js";
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
  suiAddress?: SuiAddress;
};

export type NewShinamiWalletParams = {
  type: "shinami";
  network: NetworkName;
  packageId: string;
  shinamiAccessKey: string;
  walletId: string;
  walletSecret: string;
  address?: string;
};

export async function newWallet(params: NewWalletParams): Promise<Wallet> {
  switch (params.type) {
    case "sui": {
      const { network, packageId } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });

      let { suiAddress } = params;
      if (!suiAddress) {
        suiAddress = await newSuiAddress();
      }

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
      const { packageId, network, shinamiAccessKey, walletId, walletSecret } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });
      const gasClient = new GasStationClient(shinamiAccessKey);
      const walletClient = new WalletClient(shinamiAccessKey);
      const keyClient = new KeyClient(shinamiAccessKey);

      const signer = new ShinamiWalletSigner(walletId, walletClient, walletSecret, keyClient);

      let { address } = params;
      if (!address) {
        const sessionToken = await keyClient.createSession(walletSecret);
        address = await walletClient.createWallet(walletId, sessionToken);
      }

      return new ShinamiWallet({
        suiClient,
        gasClient,
        packageId,
        address: address,
        signer,
      });
    }
  }
}
