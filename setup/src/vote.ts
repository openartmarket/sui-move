import { getExecutionStatus, TransactionBlock } from "@mysten/sui.js";

import { PACKAGE_ID, USER1_PHRASE } from "./config";
import { getSigner } from "./helpers";

export async function vote(
  artwork: string,
  voteRequest: string,
  voterAccount: string,
  choice: boolean
) {
  const { signer } = getSigner(voterAccount);
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::dao::vote`,
    arguments: [tx.object(artwork), tx.object(voteRequest), tx.pure(choice)],
  });

  try {
    const txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("getExecutionStatus", getExecutionStatus(txRes));
    return getExecutionStatus(txRes);
  } catch (e) {
    // console.error("Could not vote", e);
    throw new Error("Could not vote");
  }
}

if (process.argv.length === 3 && process.argv[2] === "atomic-run") {
  vote(
    "0xc16fe0605c177ebd778906a7b29fdf77a057e994610f77232bcbbe442d242df8",
    "0x38f905e763adf3a9bbe4a346b5a2e6617f1502148eb265cb081209371750546f",
    USER1_PHRASE,
    false
  );
}
