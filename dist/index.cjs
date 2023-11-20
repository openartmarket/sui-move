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
  endMotion: () => endMotion,
  findObjectsWithOwnerAddress: () => findObjectsWithOwnerAddress,
  getAvailableStock: () => getAvailableStock,
  getCreatedObjects: () => getCreatedObjects,
  getSigner: () => getSigner,
  handleTransactionResponse: () => handleTransactionResponse,
  mergeContractStock: () => mergeContractStock,
  mintContract: () => mintContract,
  mintContractStock: () => mintContractStock,
  splitContractStock: () => splitContractStock,
  startMotion: () => startMotion,
  toContractStock: () => toContractStock,
  transferContractStock: () => transferContractStock,
  vote: () => vote
});
module.exports = __toCommonJS(src_exports);

// src/endMotion.ts
async function endMotion(executor, params) {
  const { adminCapId, motionId } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::end_vote`,
      arguments: [txb.object(adminCapId), txb.object(motionId)]
    });
  });
  const { digest } = response;
  return { digest };
}

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
  const addressOwnedObjects = getCreatedObjects2(response).filter(
    (object) => typeof object.owner !== "string" && "AddressOwner" in object.owner
  );
  const contractStockIds = addressOwnedObjects.map((object) => object.objectId);
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

// src/startMotion.ts
async function startMotion(executor, params) {
  const { adminCapId, contractId, motion } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::start_vote`,
      arguments: [txb.object(adminCapId), txb.pure(contractId), txb.pure(motion)]
    });
  });
  const { digest } = response;
  const createdObjects = getCreatedObjects2(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const motionId = createdObject.objectId;
  return { digest, motionId };
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

// src/vote.ts
async function vote(executor, params) {
  const { contractId, motionId, choice } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::vote`,
      arguments: [txb.object(contractId), txb.object(motionId), txb.pure(choice)]
    });
  });
  const { digest } = response;
  return { digest };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  endMotion,
  findObjectsWithOwnerAddress,
  getAvailableStock,
  getCreatedObjects,
  getSigner,
  handleTransactionResponse,
  mergeContractStock,
  mintContract,
  mintContractStock,
  splitContractStock,
  startMotion,
  toContractStock,
  transferContractStock,
  vote
});
//# sourceMappingURL=index.cjs.map