import { SuiClient, SuiTransactionBlockResponse, SuiObjectData } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

type SuiAddress = {
    readonly address: string;
    readonly phrase: string;
};

type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";
type Currency = "USD" | "EUR" | "GBP" | "NOK";

interface Wallet {
    readonly address: string;
    readonly suiClient: SuiClient;
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;
type NewWalletParams = NewSuiWalletParams | NewShinamiWalletParams;
type NewSuiWalletParams = {
    type: "sui";
    network: NetworkName;
    packageId: string;
    suiAddress: SuiAddress;
};
type NewShinamiWalletParams = {
    type: "shinami";
    network: NetworkName;
    packageId: string;
    shinamiAccessKey: string;
    address: string;
};
declare function newWallet(params: NewWalletParams): Promise<Wallet>;

type EndMotionParams = {
    adminCapId: string;
    motionId: string;
};
type EndMotionResult = {
    digest: string;
};
declare function endMotion(executor: Wallet, params: EndMotionParams): Promise<EndMotionResult>;

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
    image: string;
};
type MintContractResult = {
    contractId: string;
    digest: string;
};
declare function mintContract(executor: Wallet, params: MintContractParams): Promise<MintContractResult>;

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
declare function mintContractStock(executor: Wallet, params: MintContractStockParam[]): Promise<MintContractStockResult>;

type SplitMergeTransferParams = {
    packageId: string;
    fromExecutor: Wallet;
    toExecutor: Wallet;
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
declare function startMotion(executor: Wallet, params: StartMotionParams): Promise<StartMotionResult>;

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
declare function vote(executor: Wallet, params: VoteParams): Promise<VoteResult>;

export { type BuildTransactionBlock, type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type GetContractStocksParams, type MintContractParams, type MintContractResult, type MintContractStockParam, type MintContractStockResult, type NetworkName, type NewShinamiWalletParams, type NewSuiWalletParams, type NewWalletParams, type SplitMergeTransferParams, type SplitMergeTransferResult, type StartMotionParams, type StartMotionResult, type VoteParams, type VoteResult, type Wallet, endMotion, getContractStocks, mintContract, mintContractStock, newWallet, splitTransferMerge, startMotion, toContractStock, vote };
