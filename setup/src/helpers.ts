import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
} from "@mysten/sui.js";
import { SUI_NETWORK, adminPhrase, userPhrase } from "./config";

console.log("Connecting to ", SUI_NETWORK);

export function getSigner(account: "user" | "admin" = "admin") {
  let phrase = adminPhrase;
  if (account === "user") {
    phrase = userPhrase;
  }

  const connOptions = new Connection({
    fullnode: SUI_NETWORK,
  });
  let provider = new JsonRpcProvider(connOptions);

  const keypair = Ed25519Keypair.deriveKeypair(phrase!);
  const signer = new RawSigner(keypair, provider);

  const address = keypair.getPublicKey().toSuiAddress();
  console.log(account + " signer Address = " + address);

  return { signer, address };
}
