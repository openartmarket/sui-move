# Open Art Market
PoC contracts modeling Open Art Market use case (https://www.openartmarket.com/)

## Prerequisites
- Node v18.x.x
- Install sui cli locally by following instructions [here](https://docs.sui.io/build/install)

## Sui CLI commands to get you started
- You can check the active network the cli is using by running `sui client active-env`
- If testnet is not already set run `sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443`
- To generate a new address run `sui client new-address ed25519` and store the Secret Recovery Phrase (this is what we will need to export in the next steps). You can also use this phrase to import the account in the Sui wallet
- To check existing addresses run `sui client addresses`. Active address is marked by an arrow **0xa1fd...8ce4 <=**. Can also be checked by running `sui client active-address`
- To switch to a desired address run `sui client switch-address <ADDRESS>` where ADDRESS is the entire Sui address you want to switch to
- Feel free to request from us some testnet SUI by providing us with your admin address. You can also get some SUI by requesting it from the **testnet-faucet** channel on [discord](https://discord.gg/sui)

## Quick start guide
- Install dependencies: `npm install` (optional as it is performed by the publish script)
- Export your ADMIN_PHRASE as an environment variable: `export ADMIN_PHRASE=lost soul ...`
- Export your USER_PHRASE as an environment variable: `export USER_PHRASE=lost soul ...`
- Make sure you have switched to the admin address before moving forward
- Publish the contracts: `npm run publish <network>` If you don't specify a network, it will default to `local` 
- The publish script will deploy the contracts, set the .env variables, create the displays and create an artwork

## Runnig scripts individually
- To create the display run `npm run create:artwork-display`
- To create an artwork run `npm run create:artwork`

## Sample flow
1. Run publish script which creates the Artwork & ArtworkShard displays and an artwork
1. Run artwork_shard to create an ArtworkShard
1. Run vote_request to create a vote request
1. Run vote to vote on the vote request