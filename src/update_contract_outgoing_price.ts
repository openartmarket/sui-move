import { TransactionBlock } from "@mysten/sui.js";

import { getSigner, handleTransactionResponse } from "./helpers";
import { UpdateOutgoingPriceParams } from "./types";

export async function updateOutgoingPrice({
  contractId,
  newOutgoingPrice,
  packageId,
  adminCapId,
  signerPhrase,
  network,
}: UpdateOutgoingPriceParams) {
  const { signer } = getSigner(signerPhrase, network);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(adminCapId), tx.object(contractId), tx.pure(newOutgoingPrice)],
  });

  const txRes = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
  handleTransactionResponse(txRes);
}
