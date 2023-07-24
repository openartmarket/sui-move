import { TransactionBlock } from "@mysten/sui.js";

import { ADMIN_CAP_ID, PACKAGE_ID } from "./config";
import { getSigner } from "./helpers";

export async function updateOutgoingPrice(artwork: string, newOutgoingPrice: number) {
  const { signer } = getSigner("admin");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(ADMIN_CAP_ID), tx.object(artwork), tx.pure(newOutgoingPrice)],
  });

  try {
    await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    
  } catch (e) {
    console.error("Could not update artwork outgoing price", e);
  }
}
