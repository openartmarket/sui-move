export type ContractMethod =
  | "vote"
  | "merge_artwork_shards"
  | "mint_artwork_shard"
  | "split_artwork_shard"
  | "safe_burn_artwork_shard";

export type Currency = "USD" | "EUR" | "GBP" | "NOK";

// Common interface for packages and artwork shards
export type BaseArtworkParams = {
  packageId: string;
  signerPhrase: string;
};

// Common interface for artwork shard details
export type ArtworkShardDetails = {
  artworkShardId: string;
  owner: string;
};

// Common interface for minted artwork shard details
export type MintArtworkShardResult = ArtworkShardDetails & {
  digest: string;
};

// Mint Artwork
export type MintArtworkParams = BaseArtworkParams & {
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

// Merge Artwork Shard
export type MergeArtworkShardParams = BaseArtworkParams & {
  artworkShard1Id: string;
  artworkShard2Id: string;
};

// Transfer Artwork Shard
export type TransferArtworkShardParams = BaseArtworkParams & {
  artworkId: string;
  artworkShardId: string;
  receiverAddress: string;
};

export type TransferArtworkShardResult = ArtworkShardDetails & {
  digest: string;
};

// Split Artwork Shard
export type SplitArtworkShardParams = BaseArtworkParams & {
  artworkShardId: string;
  shares: number;
};

// End Vote Request
export type EndVoteRequestParams = BaseArtworkParams & {
  adminCapId: string;
  voteRequest: string;
};

// Burn Artwork
export type BurnArtworkParams = {
  artworkId: string;
  artworkShardId: string;
  signerPhrase: string;
};

export type BurnArtworkResult = ArtworkShardDetails & {
  success: boolean;
};

// Mint Artwork Shard
export type MintArtworkShardParams = BaseArtworkParams & {
  adminCapId: string;
  artworkId: string;
  receiverAddress: string;
  shares: number;
};

export type UpdateOutgoingPriceParams = BaseArtworkParams & {
  adminCapId: string;
  artworkId: string;
  newOutgoingPrice: number;
};

export type VoteRequestParams = BaseArtworkParams & {
  artworkId: string;
  request: string;
  adminCapId: string;
};

export type VoteParams = {
  artworkId: string;
  voteRequest: string;
  voterAccount: string;
  choice: boolean;
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
