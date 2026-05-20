[![Continuous Integration](https://github.com/openartmarket/sui-move/actions/workflows/ci.yml/badge.svg)](https://github.com/openartmarket/sui-move/actions/workflows/ci.yml)

# Coownable Sui Move contract

[Coownable](https://coownable.com) is a platform for fractional co-ownership of
real-world assets — paintings, sculptures, wine, whisky, Pokemon cards, and
whatever comes next. This repository contains the on-chain Sui Move contract
and the TypeScript SDK that backs it.

The contract is **closed for modification, open for extension**: a single
`Asset` type supports any asset class without redeploying the package. Each
asset carries a `kind` discriminator (e.g. `"wine"`, `"painting"`,
`"pokemon_card"`) and stores class-specific metadata in dynamic fields keyed
by name. Adding a new asset class never requires touching this code.

## Modules

* [`coownable::asset`](./move/coownable/sources/asset.move) — Assets, Shares,
  per-holder Holdings, and the metadata extension API.
* [`coownable::governance`](./move/coownable/sources/governance.move) —
  Motions and weighted shareholder voting against an Asset.

## Concepts

### `Asset`

A shared object representing the underlying co-owned thing. Generic fields:
`kind`, `name`, `description`, `reference`, `currency`, `total_supply`,
`available_shares`, `share_price`, `outgoing_price`. Class-specific fields
(e.g. `vintage`, `artist`, `region`, `grading`) live as dynamic-field
metadata managed via `set_metadata` / `get_metadata`.

### `Share`

An owned NFT representing a fractional stake in an Asset. Carries an `amount`
plus a snapshot of the parent Asset's display fields. Supports `split`,
`merge`, `transfer`, and `safe_burn` (post-ITO).

### `Holding`

A dynamic field attached to an Asset, keyed by the holder's address. Tracks
the running total of an address's stake across many Share NFTs. Read by the
governance module to weight votes.

### `Motion` (governance)

A shared object representing a proposal put to shareholders of one Asset.
Yes/no votes weighted by `Holding.value`. One vote per address per motion.

## Extending to a new asset class

No Move changes. Mint an Asset with the new `kind` and the metadata you need:

```ts
import { mintAsset } from "@coownable/sui";

await mintAsset(adminWallet, {
  adminCapId,
  kind: "pokemon_card",
  totalShareCount: 1000,
  sharePrice: 5,
  outgoingPrice: 10_000,
  name: "Charizard 1st Edition Shadowless",
  description: "PSA 10",
  currency: "USD",
  reference: "charizard-base-set-4",
  metadata: {
    grading: "PSA 10",
    edition: "1st Edition Shadowless",
    set: "Base Set",
    year: "1999",
  },
});
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
