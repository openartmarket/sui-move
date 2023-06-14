import {
  TransactionBlock,
  getCreatedObjects,
  getExecutionStatus,
} from "@mysten/sui.js";
import { packageId, adminCap, adminPhrase } from "./config";
import { getSigner } from "./helpers";

export async function mintArtwork(params: {
  totalSupply: number;
  ingoingPrice: number;
  outgoingPrice: number;
  name: string;
  artist: string;
  creationDate: string;
  description: string;
  image: string;
}) {
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

  let { signer } = getSigner(adminPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_artwork_and_share`,
    arguments: [
      tx.object(adminCap),
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

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });

    // console.log("effects", getExecutionStatus(txRes));

    let artworkId = getCreatedObjects(txRes)?.[0].reference.objectId;
    // console.log("artworkId", artworkId);

    return artworkId;
  } catch (e) {
    // console.error("Could not mint artwork", e);
    throw new Error("Could not mint artwork");
  }
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
