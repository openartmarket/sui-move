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
var index_exports = {};
__export(index_exports, {
  endMotion: () => endMotion,
  getAddressOwner: () => getAddressOwner,
  getContractStocks: () => getContractStocks,
  getCreatedObjects: () => getCreatedObjects,
  getIntField: () => getIntField,
  getObjectData: () => getObjectData,
  getParsedData: () => getParsedData,
  getQuantity: () => getQuantity,
  getStringField: () => getStringField,
  getType: () => getType,
  getWalletQuantity: () => getWalletQuantity,
  mintContract: () => mintContract,
  mintContractStock: () => mintContractStock,
  newSuiAddress: () => newSuiAddress,
  newWallet: () => newWallet,
  splitTransferMerge: () => splitTransferMerge,
  startMotion: () => startMotion,
  toContractStock: () => toContractStock,
  vote: () => vote
});
module.exports = __toCommonJS(index_exports);

// src/endMotion.ts
async function endMotion(wallet, params) {
  const { adminCapId, motionId } = params;
  const response = await wallet.execute(async (txb, packageId) => {
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
async function getQuantity(suiClient, id) {
  const response = await suiClient.getObject({
    id,
    options: { showContent: true, showOwner: true }
  });
  const objectData = getObjectData(response);
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}
async function getWalletQuantity(wallet, id) {
  const { suiClient } = wallet;
  const response = await suiClient.getObject({
    id,
    options: { showContent: true, showOwner: true }
  });
  const objectData = getObjectData(response);
  const addressOwner = getAddressOwner(objectData);
  if (addressOwner !== wallet.address) {
    throw new Error(
      `Object ${objectData} is not owned by ${wallet.address} but by ${addressOwner}`
    );
  }
  const parsedData = getParsedData(objectData);
  return getIntField(parsedData, "shares");
}
function getAddressOwner(objectData) {
  const owner = objectData.owner;
  if (!owner) throw new Error(`Object ${objectData} has no owner`);
  if (typeof owner === "string") {
    throw new Error(`Object ${objectData} has a string owner ${owner}`);
  }
  if ("AddressOwner" in owner) {
    return owner.AddressOwner;
  }
  return null;
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
  const number = Number.parseInt(s, 10);
  if (isNaN(number) || !Number.isInteger(number)) {
    throw new Error(`${s} is not a valid integer`);
  }
  return number;
}

// src/getContractStocks.ts
async function getContractStocks(params) {
  const { suiClient, owner, contractId, packageId, cursor } = params;
  const response = await suiClient.getOwnedObjects({
    owner,
    options: {
      showContent: true
    },
    cursor
  });
  const data = response.data.map(getObjectData).filter((object) => {
    const parsedData = getParsedData(object);
    const type = `${packageId}::open_art_market::ContractStock`;
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
async function mintContract(wallet, params) {
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
    productId
  } = params;
  const responses = await queryAllTransactions(wallet.suiClient, {
    filter: {
      MoveFunction: {
        function: "mint_contract",
        module: "open_art_market",
        package: wallet.packageId
      }
    },
    options: {
      showInput: true,
      showObjectChanges: true
    }
  });
  const expected = [
    adminCapId,
    totalShareCount,
    sharePrice,
    outgoingPrice,
    name,
    artist,
    creationTimestampMillis,
    description,
    currency,
    productId
  ].map((value) => value.toString());
  let response = responses.find((res) => {
    if (res.transaction?.data?.transaction?.kind === "ProgrammableTransaction") {
      const inputs = res.transaction.data.transaction.inputs;
      const inputValues = inputs.map((input) => {
        if (input.type === "pure") {
          return input.value;
        }
        return input.objectId;
      });
      return inputValues.every((value, index) => value === expected[index]);
    }
    return false;
  });
  if (!response) {
    response = await wallet.execute(async (txb, packageId) => {
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
          // AKA reference AKA image
          txb.pure(productId)
        ]
      });
    });
  }
  const { digest } = response;
  const objects = getCreatedObjects(response);
  if (objects.length !== 1) throw new Error(`Expected 1 contract, got ${JSON.stringify(objects)}`);
  const contractId = objects[0].objectId;
  return { contractId, digest };
}
async function queryAllTransactions(client, params) {
  const data = [];
  let cursor = void 0;
  do {
    const result = await client.queryTransactionBlocks({ ...params, cursor });
    data.push(...result.data);
    cursor = result.hasNextPage ? result.nextCursor : null;
  } while (cursor !== null);
  return data;
}

// src/mintContractStock.ts
async function mintContractStock(wallet, params) {
  const { adminCapId, contractId, quantity, receiverAddress } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::mint_contract_stock`,
      arguments: [
        txb.object(adminCapId),
        txb.object(contractId),
        txb.pure(quantity),
        txb.pure(receiverAddress)
      ]
    });
  });
  const { digest } = response;
  const objects = getCreatedObjects(response);
  const ownedObjects = objects.filter((obj) => getAddressOwner(obj) !== null);
  if (ownedObjects.length !== 1) {
    throw new Error(`Expected 1 owned objects, got ${JSON.stringify(ownedObjects, null, 2)}`);
  }
  const contractStockId = ownedObjects[0].objectId;
  return { contractStockId, digest };
}

// src/mergeContractStock.ts
async function mergeContractStock(wallet, params) {
  const response = await wallet.execute(async (txb, packageId) => {
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
async function splitContractStock(wallet, params) {
  const response = await wallet.execute(async (txb, packageId) => {
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
async function transferContractStock(wallet, params) {
  const response = await wallet.execute(async (txb, packageId) => {
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
  fromWallet,
  toWallet,
  contractId,
  quantity
}) {
  const fromContractStocks = await getContractStocks({
    suiClient: fromWallet.suiClient,
    owner: fromWallet.address,
    contractId,
    packageId
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    fromContractStocks
  )) {
    await mergeContractStock(fromWallet, [{ fromContractStockId, toContractStockId }]);
  }
  const fromContractStocksAfterMerge = await getContractStocks({
    suiClient: fromWallet.suiClient,
    owner: fromWallet.address,
    contractId,
    packageId
  });
  if (fromContractStocksAfterMerge.length !== 1) {
    throw new Error(
      `Expected a single stock after merge, but got ${JSON.stringify(
        fromContractStocksAfterMerge,
        null,
        2
      )}`
    );
  }
  const currentQuantity = await getWalletQuantity(
    fromWallet,
    fromContractStocksAfterMerge[0].objectId
  );
  if (currentQuantity < quantity) {
    throw new Error(
      `Cannot transfer ${quantity} stocks, because there are only ${currentQuantity} stocks`
    );
  }
  let contractStockId;
  if (currentQuantity > quantity) {
    const { splitContractStockId } = await splitContractStock(fromWallet, {
      contractStockId: fromContractStocksAfterMerge[0].objectId,
      quantity
    });
    contractStockId = splitContractStockId;
  } else {
    contractStockId = fromContractStocks[0].objectId;
  }
  const { digest } = await transferContractStock(fromWallet, {
    contractId,
    contractStockId,
    toAddress: toWallet.address
  });
  const toContractStocks = await getContractStocks({
    suiClient: toWallet.suiClient,
    owner: toWallet.address,
    contractId,
    packageId
  });
  for (const { fromContractStockId, toContractStockId } of makeMergeContractStockParams(
    toContractStocks
  )) {
    await mergeContractStock(toWallet, [{ fromContractStockId, toContractStockId }]);
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
async function startMotion(wallet, params) {
  const { adminCapId, contractId, motion } = params;
  const response = await wallet.execute(async (txb, packageId) => {
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
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(`Didn't get JSON output from sui: ${stdout}`);
      }
    });
  });
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
async function vote(wallet, params) {
  const { contractId, motionId, choice } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::dao::vote`,
      arguments: [txb.object(contractId), txb.object(motionId), txb.pure(choice)]
    });
  });
  const { digest } = response;
  return { digest };
}

// src/Wallet.ts
var import_client = require("@mysten/sui.js/client");
var import_clients2 = require("@shinami/clients");

// src/wallets.ts
var import_bcs = require("@mysten/bcs");
var import_transactions = require("@mysten/sui.js/transactions");
var import_clients = require("@shinami/clients");
var SuiWallet = class {
  constructor(params) {
    this.params = params;
  }
  get address() {
    return this.params.keypair.toSuiAddress();
  }
  get suiClient() {
    return this.params.suiClient;
  }
  get packageId() {
    return this.params.packageId;
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
  get packageId() {
    return this.params.packageId;
  }
  async execute(build) {
    const { suiClient, gasStationClient, walletClient, keyClient, packageId, walletId, secret } = this.params;
    const signer = new import_clients.ShinamiWalletSigner(walletId, walletClient, secret, keyClient);
    const gaslessPayloadBase64 = await (0, import_clients.buildGaslessTransactionBytes)({
      sui: suiClient,
      build: (txb) => build(txb, packageId)
    });
    const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
      gaslessPayloadBase64,
      this.address,
      SUI_GAS_FEE_LIMIT
    );
    const { signature } = await signer.signTransactionBlock((0, import_bcs.fromB64)(sponsoredResponse.txBytes));
    const response = await suiClient.executeTransactionBlock({
      transactionBlock: sponsoredResponse.txBytes,
      signature: [signature, sponsoredResponse.signature],
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

// src/Wallet.ts
async function newWallet(params) {
  switch (params.type) {
    case "sui": {
      const { network, packageId, keypair } = params;
      const url = (0, import_client.getFullnodeUrl)(network);
      const suiClient = new import_client.SuiClient({ url });
      return new SuiWallet({
        packageId,
        suiClient,
        keypair
      });
    }
    case "shinami": {
      const { packageId, shinamiAccessKey, keypair } = params;
      const suiClient = (0, import_clients2.createSuiClient)(shinamiAccessKey);
      return new SuiWallet({
        packageId,
        suiClient,
        keypair
      });
    }
    case "shinami-sponsored": {
      const { packageId, shinamiAccessKey, address, walletId, secret } = params;
      const suiClient = (0, import_clients2.createSuiClient)(shinamiAccessKey);
      const gasClient = new import_clients2.GasStationClient(shinamiAccessKey);
      const keyClient = new import_clients2.KeyClient(shinamiAccessKey);
      const walletClient = new import_clients2.WalletClient(shinamiAccessKey);
      return new ShinamiWallet({
        suiClient,
        gasStationClient: gasClient,
        keyClient,
        walletClient,
        packageId,
        address,
        walletId,
        secret
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  endMotion,
  getAddressOwner,
  getContractStocks,
  getCreatedObjects,
  getIntField,
  getObjectData,
  getParsedData,
  getQuantity,
  getStringField,
  getType,
  getWalletQuantity,
  mintContract,
  mintContractStock,
  newSuiAddress,
  newWallet,
  splitTransferMerge,
  startMotion,
  toContractStock,
  vote
});
//# sourceMappingURL=index.cjs.map