import { TransactionBlock } from "@mysten/sui.js/transactions";

import { findObjectIdWithOwnerAddress } from "./findObjectIdWithOwnerAddress";
import { getClient, getSigner, handleTransactionResponse } from "./helpers";
import { MintContractStockParams, MintContractStockResult } from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function mintContractStock(
  params: MintContractStockParams
): Promise<MintContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, packageId, adminCapId, shares } = params;
  const { keypair } = getSigner(signerPhrase);
  const client = getClient();

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract_stock`,
    arguments: [
      tx.object(adminCapId),
      tx.object(contractId),
      tx.pure(shares),
      tx.pure(receiverAddress),
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
  const contractStockId = findObjectIdWithOwnerAddress(txRes, receiverAddress);
  const { digest } = txRes;
  return { contractStockId, digest, owner: receiverAddress, filledQuantity: shares };
}
