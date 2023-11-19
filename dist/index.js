// src/burn_contract_stock.ts
import { TransactionBlock } from "@mysten/sui.js/transactions";

// src/helpers.ts
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
function getSigner(phrase) {
  if (!phrase)
    throw new Error("No phrase provided");
  const keypair = Ed25519Keypair.deriveKeypair(phrase);
  const address = keypair.getPublicKey().toSuiAddress();
  return { keypair, address };
}
function handleTransactionResponse(txRes) {
  const status = getExecutionStatus(txRes);
  if (status !== "success") {
    throw new Error(`Transaction failed with status: ${status}`);
  }
}
function getExecutionStatus(txRes) {
  const status = txRes.effects?.status;
  if (status === void 0) {
    throw new Error("Failed to get execution status");
  }
  if (status.error) {
    throw new Error(status.error);
  }
  return status.status;
}
function getCreatedObjects(txRes) {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created"
  );
}

// src/burn_contract_stock.ts
async function burnContractStock(client, params) {
  const { contractStockId, contractId, packageId, signerPhrase } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${packageId}::open_art_market::safe_burn_contract_stock`,
    arguments: [tx.object(contractId), tx.object(contractStockId)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
}

// src/contract.ts
import { TransactionBlock as TransactionBlock2 } from "@mysten/sui.js/transactions";
async function mintContract(client, params) {
  const {
    adminCapId,
    packageId,
    signerPhrase,
    totalShareCount,
    sharePrice,
    outgoingPrice,
    name,
    artist,
    creationTimestampMillis,
    description,
    currency,
    image
  } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock2();
  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract`,
    arguments: [
      tx.object(adminCapId),
      tx.pure(totalShareCount),
      tx.pure(sharePrice),
      tx.pure(outgoingPrice),
      tx.pure(name),
      tx.pure(artist),
      tx.pure(creationTimestampMillis),
      tx.pure(description),
      tx.pure(currency),
      tx.pure(image)
    ]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  const contractId = getCreatedObjects(txRes)?.[0].objectId;
  if (!contractId)
    throw new Error("Could not mint contract");
  return contractId;
}

// src/end_request_voting.ts
import { TransactionBlock as TransactionBlock3 } from "@mysten/sui.js/transactions";
async function endRequestVoting(client, { voteRequest, packageId, signerPhrase, adminCapId }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock3();
  tx.moveCall({
    target: `${packageId}::dao::end_vote`,
    arguments: [tx.object(adminCapId), tx.object(voteRequest)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  return "success";
}

// src/findObjectsWithOwnerAddress.ts
function findObjectsWithOwnerAddress(txRes, address) {
  const objects = getCreatedObjects(txRes);
  return objects.filter((obj) => {
    if (typeof obj.owner === "string")
      return false;
    return "AddressOwner" in obj.owner && obj.owner.AddressOwner === address;
  });
}

// src/getters.ts
function getObjectData(response) {
  const { error, data } = response;
  if (error) {
    throw new Error(`response error: ${JSON.stringify(response)}`);
  }
  if (!data) {
    throw new Error(`No data: ${JSON.stringify(response)}`);
  }
  return data;
}
function getParsedData(data) {
  const { content } = data;
  if (!content) {
    throw new Error(`No content: ${JSON.stringify(data)}`);
  }
  return content;
}
function getStringField(data, key) {
  const { dataType } = data;
  if (dataType !== "moveObject") {
    throw new Error(`Unexpected txn.data.content.dataType: ${JSON.stringify(data)}`);
  }
  const { fields } = data;
  if (!fields) {
    throw new Error(`No txn.data.content.fields: ${JSON.stringify(data)}`);
  }
  function getStringField2(struct, key2) {
    if (Array.isArray(struct)) {
      throw new Error(`Unexpected response.data.content.fields as array: ${JSON.stringify(data)}`);
    }
    if (!(key2 in struct)) {
      throw new Error(`No response.data.content.fields[${key2}]: ${JSON.stringify(data)}`);
    }
    const value = Reflect.get(struct, key2);
    if (typeof value !== "string") {
      throw new Error(
        `Unexpected type for response.data.content.fields[${key2}]: ${JSON.stringify(data)}`
      );
    }
    return value;
  }
  return getStringField2(fields, key);
}
function getIntField(data, key) {
  const value = getStringField(data, key);
  return toInt(value);
}
function toInt(s) {
  if (!s.match(/^[0-9]+$/)) {
    throw new Error(`${s} is not a valid integer`);
  }
  const number = parseInt(s, 10);
  if (isNaN(number) || !Number.isInteger(number)) {
    throw new Error(`${s} is not a valid integer`);
  }
  return number;
}

// src/getAvailableStock.ts
async function getAvailableStock(client, contractId) {
  const response = await client.getObject({
    id: contractId,
    options: { showContent: true }
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}

// src/merge_contract_stock.ts
import { TransactionBlock as TransactionBlock4 } from "@mysten/sui.js/transactions";
async function mergeContractStock(client, params) {
  const { toContractStockId, fromContractStockId, signerPhrase, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock4();
  tx.moveCall({
    target: `${packageId}::open_art_market::merge_contract_stocks`,
    arguments: [tx.object(toContractStockId), tx.object(fromContractStockId)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  });
  handleTransactionResponse(txRes);
}

// src/mint_contract_stock.ts
import { TransactionBlock as TransactionBlock5 } from "@mysten/sui.js/transactions";
async function mintContractStock(client, params) {
  const { contractId, signerPhrase, receiverAddress, packageId, adminCapId, quantity } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock5();
  tx.moveCall({
    target: `${packageId}::open_art_market::mint_contract_stock`,
    arguments: [
      tx.object(adminCapId),
      tx.object(contractId),
      tx.pure(quantity),
      tx.pure(receiverAddress)
    ]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  const contractStocks = findObjectsWithOwnerAddress(txRes, receiverAddress);
  if (contractStocks.length !== 1)
    throw new Error(`Expected 1 contract stock id, got ${JSON.stringify(contractStocks)}`);
  const contractStockId = contractStocks[0].objectId;
  const { digest } = txRes;
  return { contractStockId, digest };
}
async function batchMintContractStock(client, params) {
  const { signerPhrase, packageId, adminCapId, list } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock5();
  for (const { contractId, receiverAddress, quantity } of list) {
    tx.moveCall({
      target: `${packageId}::open_art_market::mint_contract_stock`,
      arguments: [
        tx.object(adminCapId),
        tx.object(contractId),
        tx.pure(quantity),
        tx.pure(receiverAddress)
      ]
    });
  }
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  const results = [];
  for (const { receiverAddress } of list) {
    const contractStockIds = findObjectsWithOwnerAddress(txRes, receiverAddress).map(
      (obj) => obj.objectId
    );
    for (const contractStockId of contractStockIds) {
      const contractStock = await client.getObject({
        id: contractStockId,
        options: { showContent: true }
      });
      if (!contractStock.data?.content)
        throw new Error(
          `No content found for contractStockId=${contractStockId}: ${JSON.stringify(
            contractStock,
            null,
            2
          )}`
        );
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
        quantity: +content.fields.shares
      });
    }
  }
  const { digest } = txRes;
  return { digest, results };
}

// src/split_contract_stock.ts
import { TransactionBlock as TransactionBlock6 } from "@mysten/sui.js/transactions";
async function splitContractStock(client, params) {
  const { contractStockId, signerPhrase, quantity, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const address = keypair.getPublicKey().toSuiAddress();
  const tx = new TransactionBlock6();
  tx.moveCall({
    target: `${packageId}::open_art_market::split_contract_stock`,
    arguments: [tx.object(contractStockId), tx.pure(quantity)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  });
  handleTransactionResponse(txRes);
  const contractStocks = findObjectsWithOwnerAddress(txRes, address);
  if (contractStocks.length !== 1)
    throw new Error(`Expected 1 contract stock, got ${JSON.stringify(contractStocks)}`);
  const newContractStockId = contractStocks[0].objectId;
  return {
    contractStockId: newContractStockId
  };
}

// src/toContractStock.ts
function toContractStock(response) {
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return {
    contractStockId: objectData.objectId,
    digest: objectData.digest,
    contractId: getStringField(parsedData, "contract_id"),
    quantity: getIntField(parsedData, "shares"),
    productId: getStringField(parsedData, "reference")
  };
}

// src/transfer_contract_stock.ts
import { TransactionBlock as TransactionBlock7 } from "@mysten/sui.js/transactions";
async function transferContractStock(client, params) {
  const { contractId, signerPhrase, receiverAddress, contractStockId, packageId } = params;
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock7();
  tx.moveCall({
    target: `${packageId}::open_art_market::transfer_contract_stock`,
    arguments: [tx.object(contractId), tx.pure(contractStockId), tx.pure(receiverAddress)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  const { digest } = txRes;
  return { digest };
}

// src/update_contract_outgoing_price.ts
import { TransactionBlock as TransactionBlock8 } from "@mysten/sui.js/transactions";
async function updateOutgoingPrice(client, { contractId, newOutgoingPrice, packageId, adminCapId, signerPhrase }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock8();
  tx.moveCall({
    target: `${packageId}::open_art_market::update_outgoing_price`,
    arguments: [tx.object(adminCapId), tx.object(contractId), tx.pure(newOutgoingPrice)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
}

// src/vote.ts
import { TransactionBlock as TransactionBlock9 } from "@mysten/sui.js/transactions";
async function vote(client, { contractId, voteRequest, voterAccount, choice, packageId }) {
  const { keypair } = getSigner(voterAccount);
  const tx = new TransactionBlock9();
  tx.moveCall({
    target: `${packageId}::dao::vote`,
    arguments: [tx.object(contractId), tx.object(voteRequest), tx.pure(choice)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  return "success";
}

// src/vote_request.ts
import { TransactionBlock as TransactionBlock10 } from "@mysten/sui.js/transactions";
async function createVoteRequest(client, { contractId, request, adminCapId, packageId, signerPhrase }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new TransactionBlock10();
  tx.moveCall({
    target: `${packageId}::dao::start_vote`,
    arguments: [tx.object(adminCapId), tx.pure(contractId), tx.pure(request)]
  });
  const txRes = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showObjectChanges: true,
      showEffects: true
    }
  });
  handleTransactionResponse(txRes);
  const vote_request_id = getCreatedObjects(txRes)?.[0].objectId;
  if (!vote_request_id)
    throw new Error("Vote request not created");
  return vote_request_id;
}
export {
  batchMintContractStock,
  burnContractStock,
  createVoteRequest,
  endRequestVoting,
  findObjectsWithOwnerAddress,
  getAvailableStock,
  getCreatedObjects,
  getSigner,
  handleTransactionResponse,
  mergeContractStock,
  mintContract,
  mintContractStock,
  splitContractStock,
  toContractStock,
  transferContractStock,
  updateOutgoingPrice,
  vote
};
//# sourceMappingURL=index.js.map