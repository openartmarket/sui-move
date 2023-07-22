import { ADMIN_CAP_ID, ADMIN_PHRASE, PACKAGE_ID } from "$lib/config";

import { MintArtworkParams } from "../src/artwork";

export const mintArtworkOptions: MintArtworkParams = {
  signerPhrase: ADMIN_PHRASE,
  packageId: PACKAGE_ID,
  adminCapId: ADMIN_CAP_ID,
  totalSupply: 500,
  sharePrice: 10,
  multiplier: 100,
  name: "Mona Lisa",
  artist: "Leonardo da Vinci",
  creationDate: "1685548680595",
  description: "Choconta painting",
  currency: "USD",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
};
