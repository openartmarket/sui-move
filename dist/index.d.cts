import { SuiClient, SuiTransactionBlockResponse, SuiObjectResponse } from '@mysten/sui.js/client';
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

type MergeContractStockParam = {
    toContractStockId: string;
    fromContractStockId: string;
};
type MergeContractStockResult = {
    digest: string;
};
declare function mergeContractStock(executor: Executor, params: readonly MergeContractStockParam[]): Promise<MergeContractStockResult>;

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

type SplitContractStockParams = {
    contractStockId: string;
    quantity: number;
};
type SplitContractStockResult = {
    digest: string;
    splitContractStockId: string;
};
declare function splitContractStock(executor: Executor, params: SplitContractStockParams): Promise<SplitContractStockResult>;

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

type ContractStock = {
    contractStockId: string;
    digest: string;
    contractId: string;
    quantity: number;
    productId: string;
};
declare function toContractStock(response: SuiObjectResponse): ContractStock;

type TransferContractStockParams = {
    contractId: string;
    contractStockId: string;
    toAddress: string;
};
type TransferContractStockResult = {
    digest: string;
};
declare function transferContractStock(executor: Executor, params: TransferContractStockParams): Promise<TransferContractStockResult>;

type VoteParams = {
    contractId: string;
    motionId: string;
    choice: boolean;
};
type VoteResult = {
    digest: string;
};
declare function vote(executor: Executor, params: VoteParams): Promise<VoteResult>;

export { type ContractStock, type Currency, type EndMotionParams, type EndMotionResult, type MergeContractStockParam, type MergeContractStockResult, type MintContractParams, type MintContractResult, type MintContractStockParam, type MintContractStockResult, type NetworkName, type SplitContractStockParams, type SplitContractStockResult, type StartMotionParams, type StartMotionResult, type Target, type TransferContractStockParams, type TransferContractStockResult, type VoteParams, type VoteResult, endMotion, mergeContractStock, mintContract, mintContractStock, splitContractStock, startMotion, toContractStock, transferContractStock, vote };
