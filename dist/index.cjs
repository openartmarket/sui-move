"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  burnContractStock: () => burnContractStock,
  createVoteRequest: () => createVoteRequest,
  endRequestVoting: () => endRequestVoting,
  findObjectsWithOwnerAddress: () => findObjectsWithOwnerAddress,
  getAvailableStock: () => getAvailableStock,
  getCreatedObjects: () => getCreatedObjects,
  getSigner: () => getSigner,
  handleTransactionResponse: () => handleTransactionResponse,
  mergeContractStock: () => mergeContractStock,
  mintContract: () => mintContract,
  mintContractStock: () => mintContractStock,
  splitContractStock: () => splitContractStock,
  toContractStock: () => toContractStock,
  transferContractStock: () => transferContractStock,
  updateOutgoingPrice: () => updateOutgoingPrice,
  vote: () => vote
});
module.exports = __toCommonJS(src_exports);

// src/burn_contract_stock.ts
var import_transactions = require("@mysten/sui.js/transactions");

// src/helpers.ts
var import_ed25519 = require("@mysten/sui.js/keypairs/ed25519");
function getSigner(phrase) {
  if (!phrase)
    throw new Error("No phrase provided");
  const keypair = import_ed25519.Ed25519Keypair.deriveKeypair(phrase);
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
  const tx = new import_transactions.TransactionBlock();
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

// src/end_request_voting.ts
var import_transactions2 = require("@mysten/sui.js/transactions");
async function endRequestVoting(client, { voteRequest, packageId, signerPhrase, adminCapId }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new import_transactions2.TransactionBlock();
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
function getCreatedObjectsWithOwnerAddress(txRes, address) {
  const objects = getCreatedObjects2(txRes);
  return objects.filter((obj) => {
    if (typeof obj.owner === "string")
      return false;
    return "AddressOwner" in obj.owner && obj.owner.AddressOwner === address;
  });
}
function getCreatedObjects2(txRes) {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created"
  );
}
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

// src/mergeContractStock.ts
async function mergeContractStock(executor, params) {
  const { toContractStockId, fromContractStockId } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::merge_contract_stocks`,
      arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)]
    });
  });
  const { digest } = response;
  return { digest };
}

// src/mintContract.ts
async function mintContract(executor, params) {
  const {
    adminCapId,
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
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::mint_contract`,
      arguments: [
        txb.object(adminCapId),
        txb.pure(totalShareCount),
        txb.pure(sharePrice),
        txb.pure(outgoingPrice),
        txb.pure(name),
        txb.pure(artist),
        txb.pure(creationTimestampMillis),
        txb.pure(description),
        txb.pure(currency),
        txb.pure(image)
      ]
    });
  });
  const { digest } = response;
  const objects = getCreatedObjects(response);
  if (objects.length !== 1)
    throw new Error(`Expected 1 contract, got ${JSON.stringify(objects)}`);
  const contractId = objects[0].objectId;
  return { contractId, digest };
}

// src/mintContractStock.ts
async function mintContractStock(executor, paramsArray) {
  const response = await executor.execute((txb, packageId) => {
    for (const { adminCapId, contractId, quantity, receiverAddress } of paramsArray) {
      txb.moveCall({
        target: `${packageId}::open_art_market::mint_contract_stock`,
        arguments: [
          txb.object(adminCapId),
          txb.object(contractId),
          txb.pure(quantity),
          txb.pure(receiverAddress)
        ]
      });
    }
  });
  const contractStockIds = [];
  const receiverAddresses = new Set(paramsArray.map(({ receiverAddress }) => receiverAddress));
  for (const receiverAddress of receiverAddresses) {
    const objects = getCreatedObjectsWithOwnerAddress(response, receiverAddress);
    for (const object of objects) {
      const contractStock = await executor.client.getObject({
        id: object.objectId,
        options: { showContent: true }
      });
      const objectData = getObjectData(contractStock);
      const contractStockId = objectData.objectId;
      contractStockIds.push(contractStockId);
    }
  }
  if (contractStockIds.length !== paramsArray.length) {
    throw new Error(
      `Expected ${paramsArray.length} contract stock ids, got ${JSON.stringify(contractStockIds)}`
    );
  }
  const { digest } = response;
  return { contractStockIds, digest };
}

// src/splitContractStock.ts
async function splitContractStock(executor, params) {
  const { contractStockId, quantity } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::split_contract_stock`,
      arguments: [txb.object(contractStockId), txb.pure(quantity)]
    });
  });
  const { digest } = response;
  const createdObjects = getCreatedObjects2(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const splitContractStockId = createdObject.objectId;
  return { digest, splitContractStockId };
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

// src/transferContractStock.ts
async function transferContractStock(executor, params) {
  const { contractId, contractStockId, receiverAddress } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::transfer_contract_stock`,
      arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(receiverAddress)]
    });
  });
  const { digest } = response;
  return { digest };
}

// src/update_contract_outgoing_price.ts
var import_transactions3 = require("@mysten/sui.js/transactions");
async function updateOutgoingPrice(client, { contractId, newOutgoingPrice, packageId, adminCapId, signerPhrase }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new import_transactions3.TransactionBlock();
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
var import_transactions4 = require("@mysten/sui.js/transactions");
async function vote(client, { contractId, voteRequest, voterAccount, choice, packageId }) {
  const { keypair } = getSigner(voterAccount);
  const tx = new import_transactions4.TransactionBlock();
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
var import_transactions5 = require("@mysten/sui.js/transactions");
async function createVoteRequest(client, { contractId, request, adminCapId, packageId, signerPhrase }) {
  const { keypair } = getSigner(signerPhrase);
  const tx = new import_transactions5.TransactionBlock();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map