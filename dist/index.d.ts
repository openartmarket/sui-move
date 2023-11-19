import { SuiClient, SuiTransactionBlockResponse, SuiObjectChangeCreated } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient as SuiClient$1, SuiObjectResponse } from '@mysten/sui.js/dist/cjs/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type ContractMethod = "vote" | "merge_contract_stocks" | "mint_contract_stock" | "split_contract_stock" | "safe_burn_contract_stock";
type Currency = "USD" | "EUR" | "GBP" | "NOK";
type BaseContractParams = {
    packageId: string;
    signerPhrase: string;
};
type ContractStockDetails = {
    contractStockId: string;
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
type MintContractStockParams = BaseContractParams & BuyShareInfo & {
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

declare function burnContractStock(client: SuiClient, params: BurnContractParams): Promise<void>;

/**
 * Mints a new contract
 * @param params
 * @returns the contract id
 */
declare function mintContract(client: SuiClient, params: MintContractParams): Promise<string>;

declare function endRequestVoting(client: SuiClient, { voteRequest, packageId, signerPhrase, adminCapId }: EndVoteRequestParams): Promise<string>;

declare function findObjectsWithOwnerAddress(txRes: SuiTransactionBlockResponse, address: string): SuiObjectChangeCreated[];

declare function getAvailableStock(client: SuiClient$1, contractId: string): Promise<number>;

declare function getSigner(phrase: string): {
    keypair: Ed25519Keypair;
    address: string;
};
declare function handleTransactionResponse(txRes: SuiTransactionBlockResponse): void;
declare function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[];

declare function mergeContractStock(client: SuiClient, params: MergeContractStockParams): Promise<void>;

/**
 * Mints an contract stock
 * @returns contract stock id
 */
declare function mintContractStock(client: SuiClient, params: MintContractStockParams): Promise<MintContractStockResult>;
declare function batchMintContractStock(client: SuiClient, params: BatchMintContractStockParams): Promise<BatchMintContractStockResult>;

declare function splitContractStock(client: SuiClient, params: SplitContractStockParams): Promise<ContractStockDetails>;

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
declare function transferContractStock(client: SuiClient, params: TransferContractStockParams): Promise<TransferContractStockResult>;

declare function updateOutgoingPrice(client: SuiClient, { contractId, newOutgoingPrice, packageId, adminCapId, signerPhrase }: UpdateOutgoingPriceParams): Promise<void>;

declare function vote(client: SuiClient, { contractId, voteRequest, voterAccount, choice, packageId }: VoteParams): Promise<string>;

declare function createVoteRequest(client: SuiClient, { contractId, request, adminCapId, packageId, signerPhrase }: VoteRequestParams): Promise<string>;

export { type BaseContractParams, type BatchMintContractStockParams, type BatchMintContractStockResult, type BurnContractParams, type BuyShareInfo, type BuyShareResult, type ContractMethod, type ContractStock, type ContractStockDetails, type CreateContractDisplayParams, type CreateContractStockDisplayParams, type Currency, type Data, type Daum, type EndVoteRequestParams, type MergeContractStockParams, type MintContractParams, type MintContractStockParams, type MintContractStockResult, type MoveTransactionParams, type NetworkName, type OwnedObjectList, type SplitContractStockParams, type TransferContractStockParams, type TransferContractStockResult, type UpdateOutgoingPriceParams, type VoteParams, type VoteRequestParams, batchMintContractStock, burnContractStock, createVoteRequest, endRequestVoting, findObjectsWithOwnerAddress, getAvailableStock, getCreatedObjects, getSigner, handleTransactionResponse, mergeContractStock, mintContract, mintContractStock, splitContractStock, toContractStock, transferContractStock, updateOutgoingPrice, vote };
