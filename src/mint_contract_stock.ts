import type { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { findObjectsWithOwnerAddress } from "./findObjectsWithOwnerAddress";
import { getSigner, handleTransactionResponse } from "./helpers";
import type {
  BatchMintContractStockParams,
  BatchMintContractStockResult,
  BuyShareResult,
  MintContractStockParams,
  MintContractStockResult,
} from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function mintContractStock(
  client: SuiClient,
  params: MintContractStockParams,
): Promise<MintContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, packageId, adminCapId, quantity } = params;
  const { keypair } = getSigner(signerPhrase);

  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract_stock`,
    arguments: [
      tx.object(adminCapId),
      tx.object(contractId),
      tx.pure(quantity),
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
  const contractStockIds = findObjectsWithOwnerAddress(txRes, receiverAddress).map(
    (obj) => obj.objectId,
  );
  if (contractStockIds.length !== 1)
    throw new Error(`Expected 1 contract stock id, got ${JSON.stringify(contractStockIds)}`);
  const contractStockId = contractStockIds[0];
  const { digest } = txRes;
  return { contractStockId, digest };
}

export async function batchMintContractStock(
  client: SuiClient,
  params: BatchMintContractStockParams,
): Promise<BatchMintContractStockResult> {
  const { signerPhrase, packageId, adminCapId, list } = params;
  const { keypair } = getSigner(signerPhrase);

  const tx = new TransactionBlock();

  for (const { contractId, receiverAddress, quantity } of list) {
    tx.moveCall({
      target: `${packageId}::open_art_market::mint_contract_stock`,
      arguments: [
        tx.object(adminCapId),
        tx.object(contractId),
        tx.pure(quantity),
        tx.pure(receiverAddress),
      ],
    });
  }
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

  const results: BuyShareResult[] = [];

  for (const { receiverAddress } of list) {
    const contractStockIds = findObjectsWithOwnerAddress(txRes, receiverAddress).map(
      (obj) => obj.objectId,
    );
    for (const contractStockId of contractStockIds) {
      const contractStock = await client.getObject({
        id: contractStockId,
        options: { showContent: true },
      });
      if (!contractStock.data?.content) throw new Error("No content found");
      const content = contractStock.data.content;
      results.push({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        contractId: content.fields.contract_id,
        contractStockId,
        digest: txRes.digest,
        receiverAddress,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        quantity: +content.fields.shares,
      });
    }
  }
  const { digest } = txRes;
  return { digest, results };
}
