import { TransactionBlock, getExecutionStatus } from "@mysten/sui.js";
import { getSigner } from "./helpers";
import { adminCap, packageId } from "./config";

export async function updateOutgoingPrice(artwork: string, newOutgoingPrice: number) {
  let { signer } = getSigner("admin");
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(adminCap), tx.object(artwork), tx.pure(newOutgoingPrice)],
  });

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("effects", getExecutionStatus(txRes));
  } catch (e) {
    console.error("Could not update artwork outgoing price", e);
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  updateOutgoingPrice(
    "{artwork}",
    150
  );
}
