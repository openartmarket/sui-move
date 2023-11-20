export type NetworkName = "mainnet" | "testnet" | "devnet" | "localnet";

export type Currency = "USD" | "EUR" | "GBP" | "NOK";

export type CreateContractDisplayParams = {
  publisherId: string;
  adminPhrase: string;
  contractType: string;
};

export type CreateContractStockDisplayParams = {
  publisherId: string;
  adminPhrase: string;
  contractStockType: string;
};
