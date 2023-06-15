import { getCreatedObjects, TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export type MintArtworkParams = {
  totalSupply: number;
  ingoingPrice: number;
  outgoingPrice: number;
  name: string;
  artist: string;
  creationDate: string;
  description: string;
  image: string;
};

/**
 * Mints a new artwork
 * @param params
 * @returns the artwork id
 */
export async function mintArtwork(params: MintArtworkParams): Promise<string> {
  const {
    totalSupply,
    ingoingPrice,
    outgoingPrice,
    name,
    artist,
    creationDate,
    description,
    image,
  } = params;

  // console.log("Mint artwork: %s", name + " by " + artist);

  const { signer } = getSigner(ADMIN_PHRASE);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::mint_artwork_and_share`,
    arguments: [
      tx.object(ADMIN_CAP_ID),
      tx.pure(totalSupply),
      tx.pure(ingoingPrice),
      tx.pure(outgoingPrice),
      tx.pure(name),
      tx.pure(artist),
      tx.pure(creationDate),
      tx.pure(description),
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
    totalSupply: 500,
    ingoingPrice: 10,
    outgoingPrice: 100,
    name: "Mona Lisa",
    artist: "Leonardo da Vinci",
    creationDate: "1685548680595",
    description: "Choconta painting",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  });
}
