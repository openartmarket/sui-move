#!/usr/bin/env bash
set -e

# This script publishes the contracts
# Requires environment variables ADMIN_PHRASE and ADMIN_ADDRESS to be set

sui client switch --address "$ADMIN_ADDRESS"

network=${SUI_NETWORK_NAME:-localnet}

SUI_URL="https://fullnode.$network.sui.io:443"

# Add the environment if it doesn't exist
list=$(sui client envs)
if echo "$list" | grep -qz "$network"; then
  echo "$network already present"
else
  sui client new-env --alias "$network" --rpc "$SUI_URL"
fi

# Switch to enviroment if not active
envs=$(sui client active-env)
if [[ $envs != *"$network"* ]]; then
  sui client switch --env "$network"
fi

# Write out gas
sui client gas
# Publish the contracts
sui client publish --gas-budget 200000000 --json ./move/open_art_market > publish.res.json

# Collect the relevant data from the response
cat publish.res.json | jq -r '.objectChanges[] | select(.type == "created")' > changes.res.json


PACKAGE_ID=$(cat publish.res.json | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
ADMIN_CAP_ID=$(cat changes.res.json | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(cat changes.res.json | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(cat changes.res.json | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')


echo "Contracts published successfully"
echo "export PACKAGE_ID=$PACKAGE_ID" >> .envrc
echo "export ADMIN_CAP_ID=$ADMIN_CAP_ID" >> .envrc
echo "export PUBLISHER_ID=$PUBLISHER_ID" >> .envrc
echo "export UPGRADE_CAP_ID=$UPGRADE_CAP_ID" >> .envrc
echo "export SUI_NETWORK=$network" >> .envrc

direnv allow

# Publish the display of the contracts
direnv exec . npx ts-node ./scripts/publish-displays.ts
