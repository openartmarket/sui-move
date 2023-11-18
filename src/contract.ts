import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getCreatedObjects, getSigner, handleTransactionResponse } from "./helpers.js";
import type { MintContractParams } from "./types.js";
/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
export async function mintContract(client: SuiClient, params: MintContractParams): Promise<string> {
  const {
    adminCapId,
    packageId,
    signerPhrase,
    totalShareCount,
    sharePrice,
    outgoingPrice,
    name,
    artist,
    creationTimestampMillis,
    description,
    currency,
    image,
  } = params;

  // console.log("Mint contract: %s", name + " by " + artist);

  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract`,
    arguments: [
      tx.object(adminCapId),
      tx.pure(totalShareCount),
      tx.pure(sharePrice),
      tx.pure(outgoingPrice),
      tx.pure(name),
      tx.pure(artist),
      tx.pure(creationTimestampMillis),
      tx.pure(description),
      tx.pure(currency),
      tx.pure(image),
    ],
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  handleTransactionResponse(txRes);
  const contractId = getCreatedObjects(txRes)?.[0].objectId;
  if (!contractId) throw new Error("Could not mint contract");

  return contractId;
}
