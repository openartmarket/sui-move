import { TransactionBlock } from "@mysten/sui.js/transactions";

import {
  findObjectIdWithOwnerAddress,
  findObjectsWithOwnerAddress,
} from "./findObjectIdWithOwnerAddress";
import { getClient, getSigner, handleTransactionResponse } from "./helpers";
import {
  BatchMintContractStockParams,
  BatchMintContractStockResult,
  MintContractStockParams,
  MintContractStockResult,
} from "./types";

/**
 * Mints an contract stock
 * @returns contract stock id
 */
export async function mintContractStock(
  params: MintContractStockParams
): Promise<MintContractStockResult> {
  const { contractId, signerPhrase, receiverAddress, packageId, adminCapId, shares, network } =
    params;
  const { keypair } = getSigner(signerPhrase);
  const client = getClient(network);

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

export async function batchMintContractStock(
  params: BatchMintContractStockParams
): Promise<BatchMintContractStockResult> {
  const { signerPhrase, packageId, adminCapId, list, network } = params;
  const { keypair } = getSigner(signerPhrase);
  const client = getClient(network);

  const tx = new TransactionBlock();

  for (const { contractId, receiverAddress, shares } of list) {
    console.log({ contractId, receiverAddress, shares });
    tx.moveCall({
      target: `${packageId}::open_art_market::mint_contract_stock`,
      arguments: [
        tx.object(adminCapId),
        tx.object(contractId),
        tx.pure(shares),
        tx.pure(receiverAddress),
      ],
    });
  }
  console.log(tx);
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

  const results = [];

  for (const { receiverAddress } of list) {
    const contractStocks = await findObjectsWithOwnerAddress(txRes, receiverAddress);
    for (const contractStockId of contractStocks) {
      const contractStock = await client.getObject({
        id: contractStockId,
        options: { showContent: true },
      });
      console.log(contractStock.data);
      if (!contractStock.data?.content) throw new Error("No content found");
      const content = contractStock.data.content;
      results.push({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        contractId: content.fields.contract_id,
        contractStockId,
        digest: txRes.digest,
        owner: receiverAddress,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        shares: +content.fields.shares,
      });
    }
  }
  const { digest } = txRes;
  return { digest, results };
}
