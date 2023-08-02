import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getCreatedObjects, getSigner, handleTransactionResponse } from "./helpers";
import { MintContractParams } from "./types";
/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
export async function mintContract(params: MintContractParams): Promise<string> {
  const {
    adminCapId,
    packageId,
    signerPhrase,
    totalSupply,
    sharePrice,
    multiplier,
    name,
    artist,
    creationDate,
    description,
    currency,
    image,
    network,
  } = params;

  // console.log("Mint contract: %s", name + " by " + artist);

  const { keypair } = getSigner(signerPhrase);
  const client = getClient(network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract_and_share`,
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
