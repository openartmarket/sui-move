#!/usr/bin/env bash
set -e

# sui start &
# sleep 10

original_address=$(sui client active-address)
envs=$(sui client active-env)

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

sui client transfer-sui --amount 20000000000000 --to "$ADMIN_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 20000000000000 --to "$USER1_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 20000000000000 --to "$USER2_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
sui client transfer-sui --amount 20000000000000 --to "$USER3_ADDRESS" --gas-budget 200000000 --sui-coin-object-id "$gas_object"

sui client switch --address $ADMIN_ADDRESS

sui client active-address
sui client active-env

mkdir -p output

sui client switch --address $original_address

# TODO: Write an .envrc file instead
jq -n --arg sui_network "$SUI_NETWORK" \
      --arg admin_phrase "$ADMIN_PHRASE" \
      --arg user1_phrase "$USER1_PHRASE" \
      --arg user2_phrase "$USER2_PHRASE" \
      --arg user3_phrase "$USER3_PHRASE" \
      --arg admin_address "$ADMIN_ADDRESS" \
      --arg user1_address "$USER1_ADDRESS" \
      --arg user2_address "$USER2_ADDRESS" \
      --arg user3_address "$USER3_ADDRESS" \
      '{
        "SUI_NETWORK": $sui_network, 
        "ADMIN_PHRASE": $admin_phrase, 
        "ADMIN_ADDRESS": $admin_address, 
        "USER1_PHRASE": $user1_phrase,
        "USER2_PHRASE": $user2_phrase,
        "USER3_PHRASE": $user3_phrase,
        "USER1_ADDRESS": $user1_address,
        "USER2_ADDRESS": $user2_address,
        "USER3_ADDRESS": $user3_address
      }' > ./output/contract.json

echo "Contract details are saved in output/contract.json"

json=$(cat ./output/contract.json)
rm -f .envrc
# Iterate over the keys
keys=$(echo "$json" | jq -r 'keys[]')
for key in $keys; do
  # Get the value for the current key
  value=$(echo "$json" | jq -r ".$key")

  # Export the environment variable
  echo "export $key=\"$value\"" >> .envrc
done

echo "Environment variables are exported to .envrc file"
direnv allow