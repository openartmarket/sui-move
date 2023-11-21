import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { GasStationClient, KeyClient, ShinamiWalletSigner, WalletClient } from "@shinami/clients";

import type { Executor } from "./Executor.js";
import { ShinamiExecutor, SuiExecutor } from "./executors.js";
import type { SuiAddress } from "./sui.js";
import { newSuiAddress } from "./sui.js";
import type { NetworkName } from "./types.js";

export interface Wallet {
  readonly address: string;
  readonly executor: Executor;
}

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

      const keypair = Ed25519Keypair.deriveKeypair(suiAddress.phrase);
      const executor = new SuiExecutor({
        packageId,
        suiClient,
        keypair,
      });

      return new WalletImpl(suiAddress.address, executor);
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

      const executor = new ShinamiExecutor({
        suiClient,
        gasClient,
        packageId,
        onBehalfOf: address,
        signer,
      });
      return new WalletImpl(address, executor);
    }
  }
}

class WalletImpl implements Wallet {
  constructor(
    readonly address: string,
    readonly executor: Executor,
  ) {}
}
