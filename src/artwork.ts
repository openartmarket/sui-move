import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export type Currency = "USD" | "EUR" | "GBP" | "NOK" ;

export type MintArtworkParams = {
  signerPhrase: string;
  packageId: string;
  adminCapId: string;
  totalSupply: number;
  sharePrice: number;
  multiplier: number;
  name: string;
  artist: string;
  creationDate: string;
  description: string;
  currency: Currency;
  image: string;
};

/**
 * Mints a new artwork
 * @param params
 * @returns the artwork id
 */
export async function mintArtwork(params: MintArtworkParams): Promise<string> {
  const {adminCapId, packageId, signerPhrase, totalSupply, sharePrice, multiplier, name, artist, creationDate, description, currency, image } =
    params;

  // console.log("Mint artwork: %s", name + " by " + artist);

  const { signer } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_artwork_and_share`,
    arguments: [
      tx.object(adminCapId),
      tx.pure(totalSupply),
      tx.pure(sharePrice),
      tx.pure(multiplier),
      tx.pure(name),
      tx.pure(artist),
      tx.pure(creationDate),
      tx.pure(description),
      tx.pure(currency),
      tx.pure(image),
    ],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  const artworkId = getCreatedObjects(txRes)?.[0].reference.objectId;
  if (!artworkId) throw new Error("Could not mint artwork");

  return artworkId;
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  mintArtwork({
    signerPhrase: ADMIN_PHRASE,
    packageId: PACKAGE_ID,
    adminCapId: ADMIN_CAP_ID,
    totalSupply: 500,
    sharePrice: 10,
    multiplier: 2,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    creationDate: "1685548680595",
    description: "Choconta painting",
    currency: "USD",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  });
}
