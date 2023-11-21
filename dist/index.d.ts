import { SuiClient, SuiTransactionBlockResponse, SuiObjectData } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface Executor {
    readonly suiClient: SuiClient;
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;

type EndMotionParams = {
    adminCapId: string;
    motionId: string;
};
type EndMotionResult = {
    digest: string;
};
declare function endMotion(executor: Executor, params: EndMotionParams): Promise<EndMotionResult>;

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

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type Currency = "USD" | "EUR" | "GBP" | "NOK";
type Target = `${string}::${string}::${string}`;

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
    image: string;
};
type MintContractResult = {
    contractId: string;
    digest: string;
};
declare function mintContract(executor: Executor, params: MintContractParams): Promise<MintContractResult>;

type MintContractStockParam = {
    adminCapId: string;
    contractId: string;
    receiverAddress: string;
    quantity: number;
};
type MintContractStockResult = {
    contractStockIds: readonly string[];
    digest: string;
};
declare function mintContractStock(executor: Executor, params: MintContractStockParam[]): Promise<MintContractStockResult>;

type SplitMergeTransferParams = {
    packageId: string;
    fromExecutor: Executor;
    toExecutor: Executor;
    contractId: string;
    fromAddress: string;
    toAddress: string;
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
declare function splitTransferMerge({ packageId, fromExecutor, toExecutor, contractId, fromAddress, toAddress, quantity, }: SplitMergeTransferParams): Promise<SplitMergeTransferResult>;

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
declare function startMotion(executor: Executor, params: StartMotionParams): Promise<StartMotionResult>;

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
declare function vote(executor: Executor, params: VoteParams): Promise<VoteResult>;

interface Wallet {
    readonly address: string;
    readonly executor: Executor;
}
type NewWalletParams = NewSuiWalletParams | NewShinamiWalletParams;
type NewSuiWalletParams = {
    type: "sui";
    network: NetworkName;
    packageId: string;
    suiAddress?: SuiAddress;
};
type NewShinamiWalletParams = {
    type: "shinami";
    network: NetworkName;
    packageId: string;
    shinamiAccessKey: string;
    walletId: string;
    walletSecret: string;
    address?: string;
};
declare function newWallet(params: NewWalletParams): Promise<Wallet>;

export { type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type GetContractStocksParams, type MintContractParams, type MintContractResult, type MintContractStockParam, type MintContractStockResult, type NetworkName, type NewShinamiWalletParams, type NewSuiWalletParams, type NewWalletParams, type SplitMergeTransferParams, type SplitMergeTransferResult, type StartMotionParams, type StartMotionResult, type SuiAddress, type Target, type VoteParams, type VoteResult, type Wallet, endMotion, getContractStocks, mintContract, mintContractStock, newSuiAddress, newWallet, splitTransferMerge, startMotion, toContractStock, vote };
