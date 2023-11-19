import { SuiClient, SuiObjectResponse } from "@mysten/sui.js/dist/cjs/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  SuiClient as SuiClient$1,
  SuiTransactionBlockResponse,
  SuiObjectChangeCreated,
} from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type ContractMethod =
  | "vote"
  | "merge_contract_stocks"
  | "mint_contract_stock"
  | "split_contract_stock"
  | "safe_burn_contract_stock";
type Currency = "USD" | "EUR" | "GBP" | "NOK";
type BaseContractParams = {
  packageId: string;
  signerPhrase: string;
};
type ContractStockDetails = {
  contractStockId: string;
};
type AvailableStockParams = {
  contractId: string;
  network?: NetworkName;
};
type MintContractParams = BaseContractParams & {
  adminCapId: string;
  totalShareCount: number;
  sharePrice: number;
  outgoingPrice: number;
  name: string;
  artist: string;
  creationTimestampMillis: number;
  description: string;
  currency: Currency;
  image: string;
};
type MergeContractStockParams = BaseContractParams & {
  toContractStockId: string;
  fromContractStockId: string;
};
type TransferContractStockParams = BaseContractParams & {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};
type TransferContractStockResult = {
  digest: string;
};
type SplitContractStockParams = BaseContractParams & {
  contractStockId: string;
  quantity: number;
};
type EndVoteRequestParams = BaseContractParams & {
  adminCapId: string;
  voteRequest: string;
};
type BurnContractParams = {
  contractId: string;
  contractStockId: string;
  packageId: string;
  signerPhrase: string;
  network?: NetworkName;
};
type BuyShareInfo = {
  contractId: string;
  receiverAddress: string;
  quantity: number;
};
type MintContractStockParams = BaseContractParams &
  BuyShareInfo & {
    adminCapId: string;
  };
type MintContractStockResult = {
  contractStockId: string;
  digest: string;
};
type BatchMintContractStockParams = BaseContractParams & {
  adminCapId: string;
  list: BuyShareInfo[];
};
type BuyShareResult = BuyShareInfo & MintContractStockResult;
type BatchMintContractStockResult = {
  digest: string;
  results: BuyShareResult[];
};
type UpdateOutgoingPriceParams = BaseContractParams & {
  adminCapId: string;
  contractId: string;
  newOutgoingPrice: number;
};
type VoteRequestParams = BaseContractParams & {
  contractId: string;
  request: string;
  adminCapId: string;
};
type VoteParams = {
  contractId: string;
  packageId: string;
  voteRequest: string;
  voterAccount: string;
  choice: boolean;
  network?: NetworkName;
};
type OwnedObjectList = {
  data: Daum[];
  nextCursor: string;
  hasNextPage: boolean;
};
type Daum = {
  data: Data;
};
type Data = {
  objectId: string;
  version: string;
  digest: string;
};
type BaseDisplayParams = {
  publisherId: string;
  adminPhrase: string;
};
type CreateContractDisplayParams = BaseDisplayParams & {
  contractType: string;
};
type CreateContractStockDisplayParams = BaseDisplayParams & {
  contractStockType: string;
};
type MoveTransactionParams = {
  tx: TransactionBlock;
  packageId: string;
};
type TransferStockMoveTransactionParams = MoveTransactionParams & {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};
type MergeStockMoveTransactionParams = MoveTransactionParams & {
  toContractStockId: string;
  fromContractStockId: string;
};
type SplitStockMoveTransactionParams = MoveTransactionParams & {
  contractStockId: string;
  quantity: number;
};
type VoteMoveTransactionParams = MoveTransactionParams & {
  contractId: string;
  voteRequest: string;
  choice: boolean;
};

/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
declare function availableStock(
  client: SuiClient,
  { contractId }: AvailableStockParams,
): Promise<number>;

declare function burnContractStock(client: SuiClient$1, params: BurnContractParams): Promise<void>;

/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
declare function mintContract(client: SuiClient$1, params: MintContractParams): Promise<string>;

declare function endRequestVoting(
  client: SuiClient$1,
  { voteRequest, packageId, signerPhrase, adminCapId }: EndVoteRequestParams,
): Promise<string>;

declare function findObjectsWithOwnerAddress(
  txRes: SuiTransactionBlockResponse,
  address: string,
): SuiObjectChangeCreated[];

declare function getSigner(phrase: string): {
  keypair: Ed25519Keypair;
  address: string;
};
declare function handleTransactionResponse(txRes: SuiTransactionBlockResponse): void;
declare function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[];
declare function transferMoveCall({
  tx,
  packageId,
  contractId,
  contractStockId,
  receiverAddress,
}: TransferStockMoveTransactionParams): void;
declare function mergeMoveCall({
  tx,
  packageId,
  toContractStockId,
  fromContractStockId,
}: MergeStockMoveTransactionParams): void;
declare function splitMoveCall({
  tx,
  packageId,
  contractStockId,
  quantity,
}: SplitStockMoveTransactionParams): void;
declare function voteMoveCall({
  tx,
  packageId,
  contractId,
  voteRequest,
  choice,
}: VoteMoveTransactionParams): void;

declare function mergeContractStock(
  client: SuiClient$1,
  params: MergeContractStockParams,
): Promise<void>;

/**
 * Mints an contract stock
 * @returns contract stock id
 */
declare function mintContractStock(
  client: SuiClient$1,
  params: MintContractStockParams,
): Promise<MintContractStockResult>;
declare function batchMintContractStock(
  client: SuiClient$1,
  params: BatchMintContractStockParams,
): Promise<BatchMintContractStockResult>;

declare function splitContractStock(
  client: SuiClient$1,
  params: SplitContractStockParams,
): Promise<ContractStockDetails>;

type ContractStock = {
  contractStockId: string;
  digest: string;
  contractId: string;
  quantity: number;
  productId: string;
};
declare function toContractStock(response: SuiObjectResponse): ContractStock;

/**
 * Transfers an contract stock
 * @returns contract stock id
 */
declare function transferContractStock(
  client: SuiClient$1,
  params: TransferContractStockParams,
): Promise<TransferContractStockResult>;

declare function updateOutgoingPrice(
  client: SuiClient$1,
  { contractId, newOutgoingPrice, packageId, adminCapId, signerPhrase }: UpdateOutgoingPriceParams,
): Promise<void>;

declare function vote(
  client: SuiClient$1,
  { contractId, voteRequest, voterAccount, choice, packageId }: VoteParams,
): Promise<string>;

declare function createVoteRequest(
  client: SuiClient$1,
  { contractId, request, adminCapId, packageId, signerPhrase }: VoteRequestParams,
): Promise<string>;

export {
  type AvailableStockParams,
  type BaseContractParams,
  type BatchMintContractStockParams,
  type BatchMintContractStockResult,
  type BurnContractParams,
  type BuyShareInfo,
  type BuyShareResult,
  type ContractMethod,
  type ContractStock,
  type ContractStockDetails,
  type CreateContractDisplayParams,
  type CreateContractStockDisplayParams,
  type Currency,
  type Data,
  type Daum,
  type EndVoteRequestParams,
  type MergeContractStockParams,
  type MergeStockMoveTransactionParams,
  type MintContractParams,
  type MintContractStockParams,
  type MintContractStockResult,
  type MoveTransactionParams,
  type NetworkName,
  type OwnedObjectList,
  type SplitContractStockParams,
  type SplitStockMoveTransactionParams,
  type TransferContractStockParams,
  type TransferContractStockResult,
  type TransferStockMoveTransactionParams,
  type UpdateOutgoingPriceParams,
  type VoteMoveTransactionParams,
  type VoteParams,
  type VoteRequestParams,
  availableStock,
  batchMintContractStock,
  burnContractStock,
  createVoteRequest,
  endRequestVoting,
  findObjectsWithOwnerAddress,
  getCreatedObjects,
  getSigner,
  handleTransactionResponse,
  mergeContractStock,
  mergeMoveCall,
  mintContract,
  mintContractStock,
  splitContractStock,
  splitMoveCall,
  toContractStock,
  transferContractStock,
  transferMoveCall,
  updateOutgoingPrice,
  vote,
  voteMoveCall,
};
