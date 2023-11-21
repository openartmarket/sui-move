import { SuiClient, SuiTransactionBlockResponse, SuiObjectData } from '@mysten/sui.js/client';
import { Keypair } from '@mysten/sui.js/cryptography';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { GasStationClient, ShinamiWalletSigner } from '@shinami/clients';

interface Executor {
    readonly suiClient: SuiClient;
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type BuildTransactionBlock = (txb: TransactionBlock, packageId: string) => Promise<void>;
type SuiExecutorParams = {
    suiClient: SuiClient;
    packageId: string;
    keypair: Keypair;
};
declare class SuiExecutor implements Executor {
    private readonly params;
    readonly suiClient: SuiClient;
    constructor(params: SuiExecutorParams);
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}
type ShinamiExecutorParams = {
    suiClient: SuiClient;
    gasClient: GasStationClient;
    packageId: string;
    onBehalfOf: string;
    signer: ShinamiWalletSigner;
};
declare class ShinamiExecutor implements Executor {
    private readonly params;
    readonly suiClient: SuiClient;
    constructor(params: ShinamiExecutorParams);
    execute(build: BuildTransactionBlock): Promise<SuiTransactionBlockResponse>;
}

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

export { type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type Executor, type GetContractStocksParams, type MintContractParams, type MintContractResult, type MintContractStockParam, type MintContractStockResult, type NetworkName, ShinamiExecutor, type ShinamiExecutorParams, type SplitMergeTransferParams, type SplitMergeTransferResult, type StartMotionParams, type StartMotionResult, type SuiAddress, SuiExecutor, type SuiExecutorParams, type Target, type VoteParams, type VoteResult, endMotion, getContractStocks, mintContract, mintContractStock, newSuiAddress, splitTransferMerge, startMotion, toContractStock, vote };
