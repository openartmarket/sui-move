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
