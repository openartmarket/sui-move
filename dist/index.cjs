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
  getContractStocks: () => getContractStocks,
  mintContract: () => mintContract,
  mintContractStock: () => mintContractStock,
  newWallet: () => newWallet,
  splitTransferMerge: () => splitTransferMerge,
  startMotion: () => startMotion,
  toContractStock: () => toContractStock,
  vote: () => vote
});
module.exports = __toCommonJS(src_exports);

// src/endMotion.ts
async function endMotion(executor, params) {
  const { adminCapId, motionId } = params;
  const response = await executor.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::end_vote`,
      arguments: [txb.object(adminCapId), txb.object(motionId)]
    });
  });
  const { digest } = response;
  return { digest };
}

// src/getters.ts
function getCreatedObjects(txRes) {
  return (txRes.objectChanges || []).filter(
    (change) => change.type === "created"
  );
}
function getObjectData(response) {
  const { error, data } = response;
  if (error) {
    throw error;
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
function getType(data) {
  return getMoveObject(data).type;
}
function getStringField(data, key) {
  const { fields } = getMoveObject(data);
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
function getMoveObject(data) {
  const { dataType } = data;
  if (dataType !== "moveObject") {
    throw new Error(`Unexpected txn.data.content.dataType: ${JSON.stringify(data)}`);
  }
  return data;
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

// src/getContractStocks.ts
async function getContractStocks(params) {
  const { suiClient, owner, contractId, packageId, cursor } = params;
  const type = `${packageId}::open_art_market::ContractStock`;
  const response = await suiClient.getOwnedObjects({
    owner,
    options: {
      showContent: true
    },
    cursor
  });
  const data = response.data.map(getObjectData).filter((object) => {
    const parsedData = getParsedData(object);
    return getType(parsedData) === type && getStringField(parsedData, "contract_id") === contractId;
  });
  if (response.hasNextPage && response.nextCursor) {
    const nextData = await getContractStocks({
      ...params,
      cursor: response.nextCursor
    });
    return [...data, ...nextData];
  }
  return data;
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
  const response = await executor.execute(async (txb, packageId) => {
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
async function mintContractStock(executor, params) {
  const response = await executor.execute(async (txb, packageId) => {
    for (const { adminCapId, contractId, quantity, receiverAddress } of params) {
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
  const addressOwnedObjects = getCreatedObjects(response).filter(
    (object) => typeof object.owner !== "string" && "AddressOwner" in object.owner
  );
  const contractStockIds = addressOwnedObjects.map((object) => object.objectId);
  if (contractStockIds.length !== params.length) {
    throw new Error(
      `Expected ${params.length} contract stock ids, got ${JSON.stringify(contractStockIds)}`
    );
  }
  const { digest } = response;
  return { contractStockIds, digest };
}

// src/newWallet.ts
var import_client = require("@mysten/sui.js/client");
var import_ed25519 = require("@mysten/sui.js/keypairs/ed25519");
var import_clients2 = require("@shinami/clients");

// src/sui.ts
var import_node_child_process = require("child_process");
async function getSuiCoinObjectId() {
  const gas = await execSui("sui client gas --json");
  return gas[0].id.id;
}
async function newSuiAddress(balance = 2e10) {
  const [address, phrase] = await execSui(
    "sui client new-address ed25519 --json"
  );
  const suiCoinObjectId = await getSuiCoinObjectId();
  await transferSui({ to: address, suiCoinObjectId, amount: balance });
  return { address, phrase };
}
async function transferSui({
  to,
  suiCoinObjectId,
  amount,
  gasBudget = 2e8
}) {
  await execSui(
    `sui client transfer-sui --amount ${amount} --to "${to}" --gas-budget ${gasBudget} --sui-coin-object-id "${suiCoinObjectId}" --json`
  );
}
async function execSui(command) {
  return new Promise((resolve, reject) => {
    (0, import_node_child_process.exec)(command, (err, stdout, stderr) => {
      if (err)
        return reject(err);
      if (stderr)
        return reject(new Error(stderr));
      try {
        resolve(JSON.parse(stdout));
      } catch (err2) {
        reject(`Didn't get JSON output from sui: ${stdout}`);
      }
    });
  });
}

// src/wallets.ts
var import_bcs = require("@mysten/bcs");
var import_transactions = require("@mysten/sui.js/transactions");
var import_clients = require("@shinami/clients");
var SuiWallet = class {
  constructor(params) {
    this.params = params;
  }
  get address() {
    throw new Error("Not implemented");
  }
  get suiClient() {
    return this.params.suiClient;
  }
  async execute(build) {
    const txb = new import_transactions.TransactionBlock();
    const { suiClient, packageId, keypair } = this.params;
    await build(txb, packageId);
    const response = await suiClient.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true
      }
    });
    return checkResponse(response);
  }
};
var SUI_GAS_FEE_LIMIT = 5e6;
var ShinamiWallet = class {
  constructor(params) {
    this.params = params;
  }
  get suiClient() {
    return this.params.suiClient;
  }
  get address() {
    return this.params.address;
  }
  async execute(build) {
    const { suiClient, gasClient, packageId, address, signer } = this.params;
    const gaslessTx = await (0, import_clients.buildGaslessTransactionBytes)({
      sui: suiClient,
      build: (txb) => build(txb, packageId)
    });
    const { txBytes, signature: gasSignature } = await gasClient.sponsorTransactionBlock(
      gaslessTx,
      address,
      SUI_GAS_FEE_LIMIT
    );
    const { signature } = await signer.signTransactionBlock((0, import_bcs.fromB64)(txBytes));
    const signatures = [signature, gasSignature];
    const response = await suiClient.executeTransactionBlock({
      transactionBlock: txBytes,
      signature: signatures,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true
      }
    });
    return checkResponse(response);
  }
};
function checkResponse(response) {
  const { effects } = response;
  if (!effects) {
    throw new Error("Failed to get execution effects");
  }
  const { status } = effects;
  if (status.error) {
    throw new Error(status.error);
  }
  if (status.status !== "success") {
    throw new Error(`Transaction failed with status: ${status}`);
  }
  return response;
}

// src/newWallet.ts
async function newWallet(params) {
  switch (params.type) {
    case "sui": {
      const { network, packageId } = params;
      const url = (0, import_client.getFullnodeUrl)(network);
      const suiClient = new import_client.SuiClient({ url });
      let { suiAddress } = params;
      if (!suiAddress) {
        suiAddress = await newSuiAddress();
      }
      const { address, phrase } = suiAddress;
      const keypair = import_ed25519.Ed25519Keypair.deriveKeypair(phrase);
      return new SuiWallet({
        address,
        packageId,
        suiClient,
        keypair
      });
    }
    case "shinami": {
      const { packageId, network, shinamiAccessKey, walletId, walletSecret } = params;
      const url = (0, import_client.getFullnodeUrl)(network);
      const suiClient = new import_client.SuiClient({ url });
      const gasClient = new import_clients2.GasStationClient(shinamiAccessKey);
      const walletClient = new import_clients2.WalletClient(shinamiAccessKey);
      const keyClient = new import_clients2.KeyClient(shinamiAccessKey);
      const signer = new import_clients2.ShinamiWalletSigner(walletId, walletClient, walletSecret, keyClient);
      let { address } = params;
      if (!address) {
        const sessionToken = await keyClient.createSession(walletSecret);
        address = await walletClient.createWallet(walletId, sessionToken);
      }
      return new ShinamiWallet({
        suiClient,
        gasClient,
        packageId,
        address,
        signer
      });
    }
  }
}

// src/mergeContractStock.ts
async function mergeContractStock(executor, params) {
  const response = await executor.execute(async (txb, packageId) => {
    for (const { toContractStockId, fromContractStockId } of params) {
      txb.moveCall({
        target: `${packageId}::open_art_market::merge_contract_stocks`,
        arguments: [txb.object(toContractStockId), txb.object(fromContractStockId)]
      });
    }
  });
  const { digest } = response;
  return { digest };
}

// src/splitContractStock.ts
async function splitContractStock(executor, params) {
  const response = await executor.execute(async (txb, packageId) => {
    const { contractStockId, quantity } = params;
    txb.moveCall({
      target: `${packageId}::open_art_market::split_contract_stock`,
      arguments: [txb.object(contractStockId), txb.pure(quantity)]
    });
  });
  const { digest } = response;
  const createdObjects = getCreatedObjects(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const splitContractStockId = createdObject.objectId;
  return { digest, splitContractStockId };
}

// src/transferContractStock.ts
async function transferContractStock(executor, params) {
  const response = await executor.execute(async (txb, packageId) => {
    const { contractId, contractStockId, toAddress } = params;
    txb.moveCall({
      target: `${packageId}::open_art_market::transfer_contract_stock`,
      arguments: [txb.object(contractId), txb.pure(contractStockId), txb.pure(toAddress)]
    });
  });
  const { digest } = response;
  return { digest };
}

// src/splitTransferMerge.ts
async function splitTransferMerge({
  packageId,
  fromExecutor,
  toExecutor,
  contractId,
  fromAddress,
  toAddress,
  quantity
}) {
  const fromContractStocks = await getContractStocks({
    suiClient: fromExecutor.suiClient,
    owner: fromAddress,
    contractId,
    packageId
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    fromContractStocks
  )) {
    await mergeContractStock(fromExecutor, [{ fromContractStockId, toContractStockId }]);
  }
  const { splitContractStockId } = await splitContractStock(fromExecutor, {
    contractStockId: fromContractStocks[0].objectId,
    quantity
  });
  const { digest } = await transferContractStock(fromExecutor, {
    contractId,
    contractStockId: splitContractStockId,
    toAddress
  });
  const toContractStocks = await getContractStocks({
    suiClient: toExecutor.suiClient,
    owner: toAddress,
    contractId,
    packageId
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    toContractStocks
  )) {
    await mergeContractStock(toExecutor, [{ fromContractStockId, toContractStockId }]);
  }
  return {
    digest,
    fromContractStockId: fromContractStocks[0].objectId,
    toContractStockId: toContractStocks[0].objectId
  };
}
function makeMergeContractStockParams(contractStocks) {
  const stocksToMerge = contractStocks.slice(1);
  return stocksToMerge.map((stock) => ({
    fromContractStockId: stock.objectId,
    toContractStockId: contractStocks[0].objectId
  }));
}

// src/startMotion.ts
async function startMotion(executor, params) {
  const { adminCapId, contractId, motion } = params;
  const response = await executor.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::start_vote`,
      arguments: [txb.object(adminCapId), txb.pure(contractId), txb.pure(motion)]
    });
  });
  const { digest } = response;
  const createdObjects = getCreatedObjects(response);
  if (createdObjects.length !== 1) {
    throw new Error(`Expected 1 created object, got ${JSON.stringify(createdObjects)}`);
  }
  const createdObject = createdObjects[0];
  const motionId = createdObject.objectId;
  return { digest, motionId };
}

// src/toContractStock.ts
function toContractStock(objectData) {
  const parsedData = getParsedData(objectData);
  return {
    contractStockId: objectData.objectId,
    digest: objectData.digest,
    contractId: getStringField(parsedData, "contract_id"),
    quantity: getIntField(parsedData, "shares"),
    productId: getStringField(parsedData, "reference")
  };
}

// src/vote.ts
async function vote(executor, params) {
  const { contractId, motionId, choice } = params;
  const response = await executor.execute(async (txb, packageId) => {
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
  getContractStocks,
  mintContract,
  mintContractStock,
  newWallet,
  splitTransferMerge,
  startMotion,
  toContractStock,
  vote
});
//# sourceMappingURL=index.cjs.map