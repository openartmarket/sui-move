import type { Executor } from "./Executor";
import { makeExecutor } from "./executors";
import type { SuiAddress } from "./sui";
import { newSuiAddress } from "./sui";
import type { NetworkName } from "./types";

export interface Wallet {
  readonly address: string;
  readonly executor: Executor;
}

export type NewWalletParams = {
  network: NetworkName;
  packageId: string;
};

export async function newWallet({ packageId, network }: NewWalletParams): Promise<Wallet> {
  const suiAddress = await newSuiAddress();
  return new SuiWallet({ suiAddress, packageId, network });
}

type SuiWalletParams = {
  suiAddress: SuiAddress;
  packageId: string;
  network: NetworkName;
};

class SuiWallet implements Wallet {
  readonly address: string;
  readonly executor: Executor;

  constructor({ suiAddress, packageId, network }: SuiWalletParams) {
    this.address = suiAddress.address;
    this.executor = makeExecutor({
      type: "sui",
      phrase: suiAddress.phrase,
      network,
      packageId,
    });
  }
}
