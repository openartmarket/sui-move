import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { GasStationClient, KeyClient, ShinamiWalletSigner, WalletClient } from "@shinami/clients";

import type { Executor } from "./Executor";
import { ShinamiExecutor, SuiExecutor } from "./Executor.js";
import type { NetworkName } from "./types";

export type ExecutorParams = SuiExecutorParams | ShinamiExecutorParams;

export type SuiExecutorParams = {
  type: "sui";
  packageId: string;
  network: NetworkName;
  phrase: string;
};

export type ShinamiExecutorParams = {
  type: "shinami";
  packageId: string;
  network: NetworkName;
  shinamiAccessKey: string;
  onBehalfOf: string;
  walletId: string;
  secret: string;
};

export function makeExecutor(params: ExecutorParams): Executor {
  switch (params.type) {
    case "sui": {
      const { packageId, network, phrase } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });
      return new SuiExecutor({
        suiClient,
        keypair: Ed25519Keypair.deriveKeypair(phrase),
        packageId,
      });
    }
    case "shinami": {
      const { packageId, network, shinamiAccessKey, onBehalfOf, walletId, secret } = params;
      const url = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url });
      const gasClient = new GasStationClient(shinamiAccessKey);
      const walletClient = new WalletClient(shinamiAccessKey);
      const keyClient = new KeyClient(shinamiAccessKey);

      const signer = new ShinamiWalletSigner(walletId, walletClient, secret, keyClient);

      return new ShinamiExecutor({
        suiClient,
        gasClient,
        packageId,
        onBehalfOf,
        signer,
      });
    }
  }
}
