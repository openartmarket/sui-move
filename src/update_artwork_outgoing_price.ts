import { TransactionBlock } from "@mysten/sui.js";

import { getSigner } from "./helpers";

type UpdateOutgoingPriceParams = { 
  artwork: string; 
  newOutgoingPrice: number; 
  packageId: string;
  adminCapId: string;
};

export async function updateOutgoingPrice({ artwork, newOutgoingPrice, packageId, adminCapId }: UpdateOutgoingPriceParams) {
  const { signer } = getSigner("admin");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(adminCapId), tx.object(artwork), tx.pure(newOutgoingPrice)],
  });

  await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });
    
}
