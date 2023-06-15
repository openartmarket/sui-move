// Copyright (c) 2023, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export const PACKAGE_ID = getEnv('PACKAGE_ID');
export const PUBLISHER_ID = getEnv('PUBLISHER_ID');
export const ADMIN_CAP_ID = getEnv('ADMIN_CAP_ID');
export const ADMIN_PHRASE = getEnv('ADMIN_PHRASE');
export const USER1_PHRASE = getEnv('USER1_PHRASE');
export const USER2_PHRASE = getEnv('USER2_PHRASE');
export const USER3_PHRASE = getEnv('USER3_PHRASE');
export const SUI_NETWORK = getEnv('SUI_NETWORK');

export const ARTWORK_TYPE = `${PACKAGE_ID}::open_art_market::Artwork`;
export const ARTWORK_SHARD_TYPE = `${PACKAGE_ID}::open_art_market::ArtworkShard`;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env variable ${name}`);
  return value;
}