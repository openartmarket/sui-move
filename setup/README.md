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

PoC contracts modeling Open Art Market use case, where only the admin can create an Artwork and ArtworkShards for this artwork. 

The users can own shares of an artwork. 

The admin can create new voting requests for DAO operations. 

Multiple shareholders can vote whether they agree or not to vote requests.


### open-art-market module

<b>Structs of the module:</b>

* Artwork - The Artwork NFT is a shared object and it is created only by the admin.
* ArtworkShard - Represents shares of an Artwork NFT and it is owned by a shareholder.
* AdminCap - Admin capability to guard access restricted methods.
* Shares - Represents the number of the shares owned by an address for an Artwork.

In this module the admin can create a new Artwork and ArtworkShards. There are also the methods to transfer ownership of the ArtworkShard, to merge multiple shards that are owned by the same address or even burn an ArtworkShard.

### dao module

<b>Structs of the module:</b>

* VoteRequest - This struct represents a question that can be voted on by shareholders.
* Vote

In this module the admin can create a new voting request for the shareholders of an Artwork. Then the shareholders can vote as long as the vote request is active.

# Setup

We have implemented programmable transactions to test the flow start to end. By running `npm run test:s2e` an Artwork, and then an ArtworkShard will be created, along with a new voting request.


# Installing
```sh
../scripts/bootstrap.sh
sui client new-env --alias local --rpc http://127.0.0.1:9000 
sui client switch --env local
```

# Setup before running publish
1. Use `sui` cli tool to create a new address, one for admin and one for buyer
```sh
sui client new-address ed25519
sui client switch --address <your new address>
```
2. Install [SUI-Wallet](https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)
3. Import the address created in step 1
4. Create a `.envrc` file in the root of the project
  - Add `export ADMIN_PHRASE=<your admin phrase>` & `export USER_PHRASE=<your user phrase>` to the `.envrc` file
5. Transfer SUI coin to buyer wallet, for gas fees from SUI- Wallet

# Run publish
```sh
sui start
cd setup 
npm install
npm run publish
```