#!/bin/sh
set -ex

parse_string() {
    input_string="$1"
    address=$(echo "$input_string" | awk '{match($0, /\[0x[[:xdigit:]]+\]/); print substr($0, RSTART+1, RLENGTH-2)}')
    phrase=$(echo "$input_string" | awk '{match($0, /\[[^]]+\]/); phrase = substr($0, RSTART+1, RLENGTH-2); sub("0x[[:xdigit:]]+", "", phrase); gsub(/^[[:space:]]+|[[:space:]]+$/, "", phrase); print phrase}')
    output=$(echo "{\"address\":\"${address}\",\"phrase\":\"${phrase}\"}" | tr -d '\n')
    echo "$output"
}

sui start --no-full-node &

sleep 10

envs=$(sui client envs)
if [[ $envs != *"localnet"* ]]; then
  sui client new-env --alias localnet --rpc http://0.0.0.0:9000
fi

sui client switch --env localnet

server=$(sui client new-address ed25519)
echo $(parse_string "$server") > .address/server.json

echo $(parse_string "$server" | jq -r '.address')

sui client switch --address $(parse_string "$server" | jq -r '.address')

sui client active-address
sui client active-env

mkdir -p .address

owner=$(sui client new-address ed25519)
echo $(parse_string "$owner") > .address/owner.json

buyer=$(sui client new-address ed25519)
echo $(parse_string "$buyer") > .address/buyer.json

buyer2=$(sui client new-address ed25519)
echo $(parse_string "$buyer2") > .address/buyer2.json

publish_res=$(sui client publish --gas-budget 200000000 --json ./move/open_art_market)
echo ${publish_res} >.publish.res.json

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
ADMIN_PHRASE=$(cat .owner.json | jq -r '.phrase')
USER_PHRASE=$(cat .buyer.json | jq -r '.phrase')

cat >.env <<-ENV
PACKAGE_ID=$PACKAGE_ID
ADMIN_CAP_ID=$ADMIN_CAP_ID
PUBLISHER_ID=$PUBLISHER_ID
SUI_NETWORK=$NETWORK
ADMIN_PHRASE=$ADMIN_PHRASE
USER_PHRASE=$USER_PHRASE
ENV

tail -f /dev/null