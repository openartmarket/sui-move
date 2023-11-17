import { TransactionBlock } from "@mysten/sui.js/transactions";

export type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";

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
  signerPhrase: string;
};

// Common interface for contract stock details
export type ContractStockDetails = {
  contractStockId: string;
  // owner: string;
};

export type AvailableStockParams = {
  contractId: string;
  network?: NetworkName;
};

// Mint Contract
export type MintContractParams = BaseContractParams & {
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

// Merge Contract Stock
export type MergeContractStockParams = BaseContractParams & {
  toContractStockId: string;
  fromContractStockId: string;
};

// Transfer Contract Stock
export type TransferContractStockParams = BaseContractParams & {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};

export type TransferContractStockResult = {
  digest: string;
};

// Split Contract Stock
export type SplitContractStockParams = BaseContractParams & {
  contractStockId: string;
  quantity: number;
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
  network?: NetworkName;
};

// export type BurnContractResult = {
//   success: boolean;
// };

export type BuyShareInfo = {
  contractId: string;
  receiverAddress: string;
  quantity: number;
};
// Mint Contract Stock
export type MintContractStockParams = BaseContractParams &
  BuyShareInfo & {
    adminCapId: string;
  };

// Common interface for minted contract stock details
export type MintContractStockResult = {
  contractStockId: string;
  digest: string;
};

export type BatchMintContractStockParams = BaseContractParams & {
  adminCapId: string;
  list: BuyShareInfo[];
};

export type BuyShareResult = BuyShareInfo & MintContractStockResult;

export type BatchMintContractStockResult = {
  digest: string;
  results: BuyShareResult[];
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
  network?: NetworkName;
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
  publisherId: string;
  adminPhrase: string;
};

export type CreateContractDisplayParams = BaseDisplayParams & {
  contractType: string;
};
export type CreateContractStockDisplayParams = BaseDisplayParams & {
  contractStockType: string;
};

export type MoveTransactionParams = {
  tx: TransactionBlock;
  packageId: string;
};

export type TransferStockMoveTransactionParams = MoveTransactionParams & {
  contractId: string;
  contractStockId: string;
  receiverAddress: string;
};

export type MergeStockMoveTransactionParams = MoveTransactionParams & {
  toContractStockId: string;
  fromContractStockId: string;
};
export type SplitStockMoveTransactionParams = MoveTransactionParams & {
  contractStockId: string;
  quantity: number;
};
export type VoteMoveTransactionParams = MoveTransactionParams & {
  contractId: string;
  voteRequest: string;
  choice: boolean;
};
