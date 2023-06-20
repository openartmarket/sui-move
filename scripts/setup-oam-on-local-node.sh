#!/usr/bin/env bash
set -euo pipefail

# sui start &
# sleep 10

original_address=$(sui client active-address)
envs=$(sui client active-env)

SUI_NETWORK="http://127.0.0.1:9000"

if [[ $envs != *"localnet"* ]]; then
  
  sui client switch --env localnet
fi

server=$(sui client new-address ed25519 --json)
export ADMIN_PHRASE=$(echo $server | jq -r '.[1]')
export ADMIN_ADDRESS=$(echo $server | jq -r '.[0]')

buyer1=$(sui client new-address ed25519 --json)
export USER1_PHRASE=$(echo "$buyer1" | jq -r '.[1]')
export USER1_ADDRESS=$(echo "$buyer1" | jq -r '.[0]')

buyer2=$(sui client new-address ed25519 --json)
export USER2_PHRASE=$(echo "$buyer2" | jq -r '.[1]')
export USER2_ADDRESS=$(echo "$buyer2" | jq -r '.[0]')

buyer3=$(sui client new-address ed25519 --json)
export USER3_PHRASE=$(echo "$buyer3" | jq -r '.[1]')
export USER3_ADDRESS=$(echo "$buyer3" | jq -r '.[0]')

gas=$(sui client gas --json)
gas_object=$(echo $gas | jq -r '.[0].id.id')

sui client transfer-sui --amount 200000000000000 --to "$ADMIN_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 200000000000000 --to "$USER1_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 200000000000000 --to "$USER2_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 200000000000000 --to "$USER3_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"

sui client switch --address $ADMIN_ADDRESS

sui client active-address
sui client active-env

mkdir -p output

# This is the publish command
publish_res=$(sui client publish --gas-budget 200000000 --json ./move/open_art_market)
echo ${publish_res} >./output/publish.res.json

if [[ "$publish_res" =~ "error" ]]; then
  # If yes, print the error message and exit the script
  echo "Error during move contract publishing.  Details : $publish_res"
  exit 1
fi
echo "Contract published successfully"
# switch back to original address
sui client switch --address $original_address


PACKAGE_ID=$(echo "${publish_res}" | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
newObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "created")')
ADMIN_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')

jq -n --arg package_id "$PACKAGE_ID" \
      --arg admin_cap_id "$ADMIN_CAP_ID" \
      --arg publisher_id "$PUBLISHER_ID" \
      --arg sui_network "$SUI_NETWORK" \
      --arg admin_phrase "$ADMIN_PHRASE" \
      --arg user1_phrase "$USER1_PHRASE" \
      --arg user2_phrase "$USER2_PHRASE" \
      --arg user3_phrase "$USER3_PHRASE" \
      '{
        "PACKAGE_ID": $package_id, 
        "ADMIN_CAP_ID": $admin_cap_id, 
        "PUBLISHER_ID": $publisher_id, 
        "SUI_NETWORK": $sui_network, 
        "ADMIN_PHRASE": $admin_phrase, 
        "USER1_PHRASE": $user1_phrase,
        "USER2_PHRASE": $user2_phrase,
        "USER3_PHRASE": $user3_phrase
      }' > ./output/contract.json

echo "Contract details are saved in output/contract.json"
# tail -f /dev/null