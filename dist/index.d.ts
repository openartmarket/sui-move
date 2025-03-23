import { SuiClient, SuiTransactionBlockResponse, SuiObjectData, SuiObjectChangeCreated, SuiObjectResponse, SuiParsedData } from '@mysten/sui/client';
import { Keypair } from '@mysten/sui/cryptography';
import { Transaction } from '@mysten/sui/transactions';

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type Currency = "USD" | "EUR" | "GBP" | "NOK";

type ReadonlyWallet = {
    readonly address: string;
    readonly suiClient: SuiClient;
    readonly packageId: string;
};
interface Wallet extends ReadonlyWallet {
    execute(build: BuildTransaction): Promise<SuiTransactionBlockResponse>;
}
type BuildTransaction = (txb: Transaction, packageId: string) => Promise<void>;
type NewWalletParams = NewSuiWalletParams | NewShinamiWalletParams | NewShinamiSponsoredWalletParams;
type NewSuiWalletParams = {
    type: "sui";
    packageId: string;
    network: NetworkName;
    keypair: Keypair;
};
type NewShinamiWalletParams = {
    type: "shinami";
    packageId: string;
    shinamiAccessKey: string;
    keypair: Keypair;
};
type NewShinamiSponsoredWalletParams = {
    type: "shinami-sponsored";
    packageId: string;
    shinamiAccessKey: string;
    address: string;
    walletId: string;
    secret: string;
};
declare function newWallet(params: NewWalletParams): Promise<Wallet>;

type EndMotionParams = {
    adminCapId: string;
    motionId: string;
};
type EndMotionResult = {
    digest: string;
};
declare function endMotion(wallet: Wallet, params: EndMotionParams): Promise<EndMotionResult>;

type GetContractStocksParams = {
    suiClient: SuiClient;
    owner: string;
    contractId: string;
    packageId: string;
    cursor?: string;
};
/**
 * Returns all contract stocks of a contract owned by an address.
 */
declare function getContractStocks(params: GetContractStocksParams): Promise<readonly SuiObjectData[]>;

declare function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[];
declare function getObjectData(response: SuiObjectResponse): SuiObjectData;
declare function getParsedData(data: SuiObjectData): SuiParsedData;
declare function getType(data: SuiParsedData): string;
declare function getStringField(data: SuiParsedData, key: string): string;
/**
 * Get the quantity of a contract or a contract stock.
 */
declare function getQuantity(suiClient: SuiClient, id: string): Promise<number>;
/**
 * Get the quantity of a contract or a contract stock.
 */
declare function getWalletQuantity(wallet: ReadonlyWallet, id: string): Promise<number>;
declare function getAddressOwner(objectData: SuiObjectData): string | null;
declare function getIntField(data: SuiParsedData, key: string): number;

type MintContractParams = {
    adminCapId: string;
    totalShareCount: number;
    sharePrice: number;
    outgoingPrice: number;
    name: string;
    artist: string;
    creationTimestampMillis: number;
    description: string;
    currency: Currency;
    productId: string;
};
type MintContractResult = {
    contractId: string;
    digest: string;
};
/**
 * Mint a new contract.
 *
 * This function is idempotent. If a contract with the same parameters already exists on the chain, it will be returned.
 *
 * @param wallet - The wallet to use to mint the contract.
 * @param params - The parameters for the contract.
 * @returns The result of the minting.
 */
declare function mintContract(wallet: Wallet, params: MintContractParams): Promise<MintContractResult>;
declare function findContract(wallet: Wallet, params: MintContractParams): Promise<MintContractResult | null>;

type MintContractStockParams = {
    adminCapId: string;
    contractId: string;
    receiverAddress: string;
    quantity: number;
};
type MintContractStockResult = {
    contractStockId: string;
    digest: string;
};
/**
 * Mint a new contract stock.
 *
 * This function is idempotent. If a contract stock with the same parameters already exists on the chain, it will be returned.
 *
 * @param wallet - The wallet to use to mint the contract stock.
 * @param params - The parameters for the contract stock.
 * @returns The result of the minting.
 */
declare function mintContractStock(wallet: Wallet, params: MintContractStockParams): Promise<MintContractStockResult>;
declare function findContractStock(wallet: Wallet, params: MintContractStockParams): Promise<MintContractStockResult | null>;

type SplitMergeTransferParams = {
    packageId: string;
    fromWallet: Wallet;
    toWallet: Wallet;
    contractId: string;
    quantity: number;
};
type SplitMergeTransferResult = {
    digest: string;
    fromContractStockId: string;
    toContractStockId: string;
};
/**
 * Transfers a quantity of contract stock from one address to another.
 * Takes care of splitting and merging so that aftet the transfer,
 * both addresses have a single stock.
 */
declare function splitTransferMerge({ packageId, fromWallet, toWallet, contractId, quantity, }: SplitMergeTransferParams): Promise<SplitMergeTransferResult>;

type StartMotionParams = {
    adminCapId: string;
    contractId: string;
    /**
     * The motion to vote on
     */
    motion: string;
};
type StartMotionResult = {
    digest: string;
    motionId: string;
};
declare function startMotion(wallet: Wallet, params: StartMotionParams): Promise<StartMotionResult>;

type SuiAddress = {
    readonly address: string;
    readonly phrase: string;
};
/**
 * Creates a new address and transfers balance to it.
 */
declare function newSuiAddress(balance?: number): Promise<SuiAddress>;

type ContractStock = {
    contractStockId: string;
    digest: string;
    contractId: string;
    quantity: number;
    productId: string;
};
declare function toContractStock(objectData: SuiObjectData): ContractStock;

type VoteParams = {
    contractId: string;
    motionId: string;
    choice: boolean;
};
type VoteResult = {
    digest: string;
};
declare function vote(wallet: Wallet, params: VoteParams): Promise<VoteResult>;

export { type BuildTransaction, type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type GetContractStocksParams, type MintContractParams, type MintContractResult, type MintContractStockParams, type MintContractStockResult, type NetworkName, type NewShinamiSponsoredWalletParams, type NewShinamiWalletParams, type NewSuiWalletParams, type NewWalletParams, type ReadonlyWallet, type SplitMergeTransferParams, type SplitMergeTransferResult, type StartMotionParams, type StartMotionResult, type SuiAddress, type VoteParams, type VoteResult, type Wallet, endMotion, findContract, findContractStock, getAddressOwner, getContractStocks, getCreatedObjects, getIntField, getObjectData, getParsedData, getQuantity, getStringField, getType, getWalletQuantity, mintContract, mintContractStock, newSuiAddress, newWallet, splitTransferMerge, startMotion, toContractStock, vote };
