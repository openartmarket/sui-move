#!/bin/sh
set -ex

parse_string() {
    input_string="$1"
    address=$(echo "$input_string" | awk '{match($0, /\[0x[[:xdigit:]]+\]/); print substr($0, RSTART+1, RLENGTH-2)}')
    phrase=$(echo "$input_string" | awk '{match($0, /\[[^]]+\]/); phrase = substr($0, RSTART+1, RLENGTH-2); sub("0x[[:xdigit:]]+", "", phrase); gsub(/^[[:space:]]+|[[:space:]]+$/, "", phrase); print phrase}')
    output=$(echo "{\"address\":\"${address}\",\"phrase\":\"${phrase}\"}" | tr -d '\n')
    echo "$output"
}
extract_first_address() {
  local string=$1
  local address

  address=$(echo "$string" | awk 'NR>2 {print $1; exit}')

  echo "$address"
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
  local user_phrase=$6

  printf '{"package_id": "%s", "admin_cap_id": "%s", "publisher_id": "%s", "network": "%s", "admin_phrase": "%s", "user_phrase": "%s"}\n' \
    "$package_id" "$admin_cap_id" "$publisher_id" "$network" "$admin_phrase" "$user_phrase"
}

sui start &
sleep 10

envs=$(sui client active-env)

if [[ $envs != *"localnet"* ]]; then
  sui client switch --env localnet
fi

server=$(sui client new-address ed25519)
export ADMIN_PHRASE=$(parse_string "$server" | jq '.phrase')
export ADMIN_ADDRESS=$(parse_string "$server" | jq '.address')

sui client active-env
gas=$(sui client gas)

gas_object=$(extract_first_address "$gas")

sui client transfer-sui --amount 20000000000000000 --to "$(remove_quotes $ADMIN_ADDRESS)" --gas-budget 200000000 --sui-coin-object-id "$gas_object"

sui client switch --address $(parse_string "$server" | jq -r '.address')

sui client active-address
sui client active-env

mkdir -p output

owner=$(sui client new-address ed25519)
export OWNER_PHRASE=$(parse_string "$owner" | jq '.phrase')

buyer=$(sui client new-address ed25519)
export USER_PHRASE=$(parse_string "$buyer" | jq '.phrase')

buyer2=$(sui client new-address ed25519)
export USER2_PHRASE=$(parse_string "$buyer2" | jq '.phrase')

publish_res=$(sui client publish --gas-budget 200000000 --json ./move/open_art_market)
echo ${publish_res} >./output/publish.res.json

if [[ "$publish_res" =~ "error" ]]; then
  # If yes, print the error message and exit the script
  echo "Error during move contract publishing.  Details : $publish_res"
  exit 1
fi

PACKAGE_ID=$(echo "${publish_res}" | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
newObjs=$(echo "$publish_res" | jq -r '.objectChanges[] | select(.type == "created")')
ADMIN_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::Publisher")).objectId')
UPGRADE_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')

output_json "$PACKAGE_ID" "$ADMIN_CAP_ID" "$PUBLISHER_ID" "$NETWORK" "$ADMIN_PHRASE" "$USER_PHRASE" > output/contract.json

sleep 1000

tail -f /dev/null