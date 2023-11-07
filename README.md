[![Continuous Integration](https://github.com/openartmarket/sui-move/actions/workflows/ci.yml/badge.svg)](https://github.com/openartmarket/sui-move/actions/workflows/ci.yml)

# Open Art Market SUI Move contracts

[Open Art Market](https://openartmarket.com) uses blockchain technology to provide a public, transparent and decentralized way to manage unique artwork assets and their shares.

These contracts are deployed publicly on the [SUI blockchain](https://sui.io/) where anyone can verify the code. 
All assets, asset shares and votes are represented on the blockchain, allowing anyone to verify the state of the system.

This repository contains the smart contracts for Open Art Market.

## Contracts

* [Open Art Market](./move/sources/open_art_market.move) manages unique artwork assets their shares.
* [DAO voting](./move/sources/dao.move) manages vote proposals and votes.

## Contributing

Open Art Market invites anyone to review and improve the code for the smart contracts. 
If you are interested in contributing, please read our [contributing guidelines](CONTRIBUTING.md).

# Smart Contracts

PoC contracts modeling Open Art Market use case, where only the admin can create an Contract and ContractStocks for this contract. 
The users can own shares of an contract. 
The admin can create new voting requests for DAO operations. 
Multiple shareholders can vote whether they agree or not to vote requests.

### open-art-market module

<b>Structs of the module:</b>

* Contract - The Contract NFT is a shared object and it is created only by the admin.
* ContractStock - Represents shares of an Contract NFT and it is owned by a shareholder.
* AdminCap - Admin capability to guard access restricted methods.
* Shares - Represents the number of the shares owned by an address for an Contract.

In this module the admin can create a new Contract and ContractStocks. There are also the methods to transfer ownership of the ContractStock, to merge multiple stocks that are owned by the same address or even burn an ContractStock.

### dao module

<b>Structs of the module:</b>

* VoteRequest - This struct represents a question that can be voted on by shareholders.
* Vote

In this module the admin can create a new voting request for the shareholders of an Contract. Then the shareholders can vote as long as the vote request is active.

