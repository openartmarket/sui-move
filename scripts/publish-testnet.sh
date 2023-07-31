#!/usr/bin/env bash
set -e

# This script publishes the contracts
# Requires environment variables ADMIN_PHRASE and ADMIN_ADDRESS to be set

# Add a wallet to the system, so that we can publish the contracts
# This wallet needs to have SUI coins on it to pay for gas
sui keytool import "$ADMIN_PHRASE" ed25519
sui client switch --address "$ADMIN_ADDRESS"

SUI_NETWORK=https://fullnode.testnet.sui.io:443

# Add the testnet environment if it doesn't exist
list=$(sui client envs)
if echo "$list" | grep -qz "testnet"; then
  echo "testnet already present"
else
  sui client new-env --alias testnet --rpc "$SUI_NETWORK"
fi

# Switch to testnet if not active
envs=$(sui client active-env)
if [[ $envs != *"testnet"* ]]; then
  sui client switch --env testnet
fi

# Write out gas
sui client gas
# Publish the contracts
sui client publish --gas-budget 200000000 --json ./move/open_art_market > publish.res.json

# Collect the relevant data from the response
cat publish.res.json | jq -r '.objectChanges[] | select(.type == "created")' > changes.res.json


PACKAGE_ID=$(cat publish.testnet.json | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
ADMIN_CAP_ID=$(cat changes.testnet.json | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(cat changes.testnet.json | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(cat changes.testnet.json | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')

# Publish the display of the contracts
npx ts-node ./scripts/publish-displays.ts


echo "Contracts published successfully"
echo "export PACKAGE_ID=$PACKAGE_ID" >> .envrc
echo "export ADMIN_CAP_ID=$ADMIN_CAP_ID" >> .envrc
echo "export PUBLISHER_ID=$PUBLISHER_ID" >> .envrc
echo "export UPGRADE_CAP_ID=$UPGRADE_CAP_ID" >> .envrc
echo "export SUI_NETWORK=$SUI_NETWORK" >> .envrc

direnv allow