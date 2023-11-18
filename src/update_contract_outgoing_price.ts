import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { getSigner, handleTransactionResponse } from "./helpers";
import type { UpdateOutgoingPriceParams } from "./types";

export async function updateOutgoingPrice(
  client: SuiClient,
  { contractId, newOutgoingPrice, packageId, adminCapId, signerPhrase }: UpdateOutgoingPriceParams,
) {
  const { keypair } = getSigner(signerPhrase);
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
