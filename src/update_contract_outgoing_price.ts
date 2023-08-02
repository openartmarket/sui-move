import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getClient, getSigner, handleTransactionResponse } from "./helpers";
import { UpdateOutgoingPriceParams } from "./types";

export async function updateOutgoingPrice({
  contractId,
  newOutgoingPrice,
  packageId,
  adminCapId,
  signerPhrase,
}: UpdateOutgoingPriceParams) {
  const { keypair } = getSigner(signerPhrase);
  const client = getClient();
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(adminCapId), tx.object(contractId), tx.pure(newOutgoingPrice)],
  });

  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
}
