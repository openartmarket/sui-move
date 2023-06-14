// Copyright (c) 2023, Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export const packageId = process.env.PACKAGE_ID!;
export const publisher = process.env.PUBLISHER_ID!;
export const adminCap = process.env.ADMIN_CAP_ID!;
export const adminPhrase = process.env.ADMIN_PHRASE!;
export const userPhrase = process.env.USER_PHRASE!;
export const SUI_NETWORK = process.env.SUI_NETWORK!;

export const ARTWORK_TYPE = `${packageId}::open_art_market::Artwork`;
export const ARTWORK_SHARD_TYPE = `${packageId}::open_art_market::ArtworkShard`;