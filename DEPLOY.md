# Deploy Sui contracts

## Prerequisites

Create a new address that will be the deployer of the contracts.

    ./scripts/new-address.sh

This will print out something like the following:

    SUI_PHRASE="spin brass crouch boil before glance gain rural program web tomorrow prefer"
    SUI_ADDRESS="0xd5a2e9462411dc154ffe8c76e566fdd380090f02f06f44ebf230135566bf13f7"

Store this in a secure place (e.g. a password manager).

Paste it into your terminal - it's needed in the steps below

Switch to this address:

    sui client switch --address $SUI_ADDRESS

## Confiure the environment

First, list the available environments.

    sui client envs

If the environment you want to deploy to is not listed, add it. E.g:

    sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

Tell the client where to deploy to.

    sui client switch --env testnet

## Deploy the contracts

First, check that you have gas

    sui client gas

Next, deploy the contracts.

    sui client publish --gas-budget 200000000 --json ./move/open_art_market > publish-output.json

## Create the displays

    cd setup
    npm run create:contract-display
    npm run create:contract-stock-display

## Create an contract

Now we need to define the PACKAGE_ID and ADMIN_CAP_ID. These values are in `publish-output.json` created above.
Extract them:

    cat publish-output.json | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId'