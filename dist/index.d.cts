import { SuiClient, SuiTransactionBlockResponse, SuiObjectData } from '@mysten/sui.js/client';
import { Keypair } from '@mysten/sui.js/cryptography';
import { TransactionBlock } from '@mysten/sui.js/transactions';

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type Currency = "USD" | "EUR" | "GBP" | "NOK";

interface Wallet {
    readonly address: string;
    readonly suiClient: SuiClient;
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;
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
declare function mintContract(wallet: Wallet, params: MintContractParams): Promise<MintContractResult>;

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
declare function mintContractStock(wallet: Wallet, params: MintContractStockParams): Promise<MintContractStockResult>;

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

export { type BuildTransactionBlock, type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type GetContractStocksParams, type MintContractParams, type MintContractResult, type MintContractStockParams, type MintContractStockResult, type NetworkName, type NewShinamiSponsoredWalletParams, type NewShinamiWalletParams, type NewSuiWalletParams, type NewWalletParams, type SplitMergeTransferParams, type SplitMergeTransferResult, type StartMotionParams, type StartMotionResult, type SuiAddress, type VoteParams, type VoteResult, type Wallet, endMotion, getContractStocks, mintContract, mintContractStock, newSuiAddress, newWallet, splitTransferMerge, startMotion, toContractStock, vote };
