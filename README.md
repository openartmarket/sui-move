# Open Art Market SUI Move contracts
This repository contains the smart contracts for the Open Art Market project.

## Contracts
1. Open Art Market
    Manages the unique asset and the sale of shares in them.
2. DAO voting 
    Manages vote proposals and votes for each of the options.

## Transparency
We use blockchain to document the our and our users actions in a transparent way. 
These contracts are deployed publicly on the [SUI blockchain] and can be verified to contain the same code. 
All assets, asset shares and votes are represented in the Objects on chain in an easy to read manner, allowing anyone to verify the state of the system.

## Further development
We would love for the community to review and improve our code. If you are interested in contributing, please read our [contributing guidelines](CONTRIBUTING.md)

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">Smart Contracts</a>
      <ul>
        <li><a href="#open-art-market">open_art_market module</a></li>
      </ul>
      <ul>
        <li><a href="#dao">dao module</a></li>
      </ul>
    </li>
    <li>
      <a href="#setup">Setup</a>
    </li>
  </ol>
</details>


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

