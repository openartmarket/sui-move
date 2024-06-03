#!/usr/bin/env bash
set -euo pipefail

# This script publishes the contracts to the network SUI_NETWORK_NAME
# Requires environment variables SUI_NETWORK_NAME, ADMIN_PHRASE and ADMIN_ADDRESSto be set
# Requires the admin address to have been imported to the client through ./scripts/utils/import-address.sh
# Requires the admin address to have gas funds on it

sui client switch --address "$ADMIN_ADDRESS"
./scripts/utils/switch-environment.sh

# sui client gas

rm -rf tmp
mkdir -p tmp
# Publish the contracts
sui client publish --gas-budget 200000000 --json --skip-fetch-latest-git-deps ./move/open_art_market > tmp/publish.res.json

# Collect the relevant data from the response
cat tmp/publish.res.json | jq -r '.objectChanges[] | select(.type == "created")' > tmp/changes.res.json

PACKAGE_ID=$(cat tmp/publish.res.json | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
ADMIN_CAP_ID=$(cat tmp/changes.res.json | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(cat tmp/changes.res.json | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(cat tmp/changes.res.json | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')

echo "Contracts published successfully"
echo "export PACKAGE_ID=\"$PACKAGE_ID\"" >> .sui.env
echo "export ADMIN_CAP_ID=\"$ADMIN_CAP_ID\"" >> .sui.env
echo "export PUBLISHER_ID=\"$PUBLISHER_ID\"" >> .sui.env
echo "export UPGRADE_CAP_ID=\"$UPGRADE_CAP_ID\"" >> .sui.env

direnv allow

# Publish the display of the contracts
direnv exec . npx tsx ./scripts/publish-displays.ts

echo "✅ Package published → https://suiscan.xyz/$SUI_NETWORK/object/$PACKAGE_ID"