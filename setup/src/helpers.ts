import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
} from "@mysten/sui.js";

import { SUI_NETWORK } from "./config";

// console.log("Connecting to ", SUI_NETWORK);

export function getSigner(phrase: string): {
  signer: RawSigner;
  address: string;
} {
  const connOptions = new Connection({
    fullnode: SUI_NETWORK,
  });
  const provider = new JsonRpcProvider(connOptions);

  const keypair = Ed25519Keypair.deriveKeypair(phrase!);
  const signer = new RawSigner(keypair, provider);

  const address = keypair.getPublicKey().toSuiAddress();
  // console.log("Address = " + address);

  return { signer, address };
}
