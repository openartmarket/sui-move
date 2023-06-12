import { TransactionBlock, getExecutionStatus } from "@mysten/sui.js";
import { getSigner } from "./helpers";
import { packageId } from "./config";

export async function vote(
  artworkShard: string,
  voteRequest: string,
  choice: boolean
) {
  let signer = getSigner();
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::dao::vote`,
    arguments: [
      tx.object(artworkShard),
      tx.object(voteRequest),
      tx.pure(choice),
    ],
  });

  try {
    let txRes = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showEffects: true,
      },
    });

    console.log("effects", getExecutionStatus(txRes)?.status, txRes.effects);
  } catch (e) {
    console.error("Could not vote", e);
  }
}

vote("0xc16fe0605c177ebd778906a7b29fdf77a057e994610f77232bcbbe442d242df8", "0x38f905e763adf3a9bbe4a346b5a2e6617f1502148eb265cb081209371750546f", false);