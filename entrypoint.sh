#!/bin/sh
set -ex

extract_first_address() {
  local string=$1
  echo "$string"
  echo "$string" | jq -r '.[0].id.id'
}
remove_quotes() {
    local string="$1"
    local result=""    
    # Remove all quote marks from the string
    result=$(echo "$string" | sed 's/"//g')
    echo "$result"
}

output_json() {
  local package_id=$1
  local admin_cap_id=$2
  local publisher_id=$3
  local network=$4
  local admin_phrase=$5
  local user1_phrase=$6

  jq -n --arg package_id "$package_id" \
        --arg admin_cap_id "$admin_cap_id" \
        --arg publisher_id "$publisher_id" \
        --arg network "$network" \
        --arg admin_phrase "$admin_phrase" \
        --arg user1_phrase "$user1_phrase" \
        '{"package_id": $package_id, "admin_cap_id": $admin_cap_id, "publisher_id": $publisher_id, "network": $network, "admin_phrase": $admin_phrase, "user1_phrase": $user1_phrase}'
}

original_address=$(sui client active-address --json)
envs=$(sui client active-env)

if [[ $envs != *"localnet"* ]]; then
  sui client switch --env localnet
fi

server=$(sui client new-address ed25519 --json)
export ADMIN_PHRASE=$(echo $server | jq -r '.[1]')
export ADMIN_ADDRESS=$(echo $server | jq '.[0]')

gas=$(sui client gas --json)

gas_object=$(echo $gas | jq -r '.[0].id.id')

sui client transfer-sui --amount 200000000000000 --to "$(remove_quotes $ADMIN_ADDRESS)" --gas-budget 200000000 --sui-coin-object-id "$gas_object"

sui client switch --address $(remove_quotes $ADMIN_ADDRESS)

sui client active-address
sui client active-env

mkdir -p output

owner=$(sui client new-address ed25519 --json)
export OWNER_PHRASE=$(echo "$owner" | jq -r '.[1]')

buyer=$(sui client new-address ed25519 --json)
export USER1_PHRASE=$(echo "$buyer" | jq -r '.[1]')

buyer2=$(sui client new-address ed25519 --json)
export USER2_PHRASE=$(echo "$buyer2" | jq -r '.[1]')


publish_res=$(sui client publish --gas-budget 200000000 --json ./move/open_art_market)
echo ${publish_res} >./output/publish.res.json

if [[ "$publish_res" =~ "error" ]]; then
  # If yes, print the error message and exit the script
  echo "Error during move contract publishing.  Details : $publish_res"
  exit 1
fi

# switch back to original address
sui client switch --address $(remove_quotes $original_address)


PACKAGE_ID=$(echo "${publish_res}" | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
newObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "created")')
ADMIN_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')

output_json "$PACKAGE_ID" "$ADMIN_CAP_ID" "$PUBLISHER_ID" "$SUI_NETWORK" "$ADMIN_PHRASE" "$USER1_PHRASE" > output/contract.json

cat >./.envrc <<-EOF
export ADMIN_PHRASE="$ADMIN_PHRASE"
export OWNER_PHRASE="$OWNER_PHRASE"
export USER1_PHRASE="$USER1_PHRASE"
export USER2_PHRASE="$USER2_PHRASE"
export SUI_NETWORK="http://127.0.0.1:9000"
export PACKAGE_ID="$PACKAGE_ID"
export ADMIN_CAP_ID="$ADMIN_CAP_ID"
export PUBLISHER_ID="$PUBLISHER_ID"
EOF

direnv allow

cd setup

echo "Waiting for Fullnode to sync..."
sleep 5

echo "Installing dependencies..."

npm install

echo "Creating Artwork Display..."

npm run create:artwork-display
sleep 5

npm run create:artwork-shard-display
sleep 5


tail -f /dev/null