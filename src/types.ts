import { JsonRpcProvider } from "@mysten/sui.js";

export type ContractMethod =
  | "vote"
  | "merge_contract_stocks"
  | "mint_contract_stock"
  | "split_contract_stock"
  | "safe_burn_contract_stock";

export type Currency = "USD" | "EUR" | "GBP" | "NOK";

// Common interface for packages and contract stocks
export type BaseContractParams = {
  packageId: string;
  provider: JsonRpcProvider;
  signerPhrase: string;
};

// Common interface for contract stock details
export type ContractStockDetails = {
  contractStockId: string;
  owner: string;
};

// Common interface for minted contract stock details
export type MintContractStockResult = ContractStockDetails & {
  digest: string;
};

// Mint Contract
export type MintContractParams = BaseContractParams & {
  adminCapId: string;
  totalSupply: number;
  sharePrice: number;
  multiplier: number;
  name: string;
  artist: string;
  creationDate: string;
  description: string;
  currency: Currency;
  image: string;
};

// Merge Contract Stock
export type MergeContractStockParams = BaseContractParams & {
  contractStock1Id: string;
  contractStock2Id: string;
};

// Transfer Contract Stock
export type TransferContractStockParams = BaseContractParams & {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};

export type TransferContractStockResult = ContractStockDetails & {
  digest: string;
};

// Split Contract Stock
export type SplitContractStockParams = BaseContractParams & {
  contractStockId: string;
  shares: number;
};

// End Vote Request
export type EndVoteRequestParams = BaseContractParams & {
  adminCapId: string;
  voteRequest: string;
};

// Burn Contract
export type BurnContractParams = {
  contractId: string;
  contractStockId: string;
  packageId: string;
  signerPhrase: string;
  provider: JsonRpcProvider;
};

export type BurnContractResult = ContractStockDetails & {
  success: boolean;
};

// Mint Contract Stock
export type MintContractStockParams = BaseContractParams & {
  adminCapId: string;
  contractId: string;
  receiverAddress: string;
  shares: number;
};

export type UpdateOutgoingPriceParams = BaseContractParams & {
  adminCapId: string;
  contractId: string;
  newOutgoingPrice: number;
};

export type VoteRequestParams = BaseContractParams & {
  contractId: string;
  request: string;
  adminCapId: string;
};

export type VoteParams = {
  contractId: string;
  packageId: string;
  voteRequest: string;
  voterAccount: string;
  choice: boolean;
  provider: JsonRpcProvider;
};

export type OwnedObjectList = {
  data: Daum[];
  nextCursor: string;
  hasNextPage: boolean;
};

export type Daum = {
  data: Data;
};

export type Data = {
  objectId: string;
  version: string;
  digest: string;
};

type BaseDisplayParams = {
  PUBLISHER_ID: string;
  ADMIN_PHRASE: string;
  SUI_NETWORK: string;
};

export type CreateContractDisplayParams = BaseDisplayParams & {
  CONTRACT_TYPE: string;
};
export type CreateContractStockDisplayParams = BaseDisplayParams & {
  CONTRACT_STOCK_TYPE: string;
};
