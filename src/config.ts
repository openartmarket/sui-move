export const SUI_NETWORK = getEnv("SUI_NETWORK");
export const PACKAGE_ID = getEnv("PACKAGE_ID");
export const ARTWORK_TYPE = `${PACKAGE_ID}::open_art_market::Artwork`;
export const ARTWORK_SHARD_TYPE = `${PACKAGE_ID}::open_art_market::ArtworkShard`;

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}
