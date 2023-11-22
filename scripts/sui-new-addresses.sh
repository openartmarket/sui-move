#!/usr/bin/env bash
set -euo pipefail

envs=$(sui client active-env)

gas=$(sui client gas --json)
echo $gas
sui_coin_object_id=$(echo $gas | jq -r '.[0].id.id')

rm -f .sui.env

function new_address() {
  name=$1
  amount=$2
  address_json=$(sui client new-address ed25519 --json)
  address=$(echo $address_json | jq -r '.[0]')
  phrase=$(echo $address_json | jq -r '.[1]')
  echo "export ${name}_ADDRESS=\"$address\"" >> .sui.env
  echo "export ${name}_PHRASE=\"$phrase\"" >> .sui.env

  sui client transfer-sui \
    --gas-budget 200000000 \
    --amount     "$amount" \
    --to         "$address" \
    --sui-coin-object-id "$sui_coin_object_id" \
    --json
}

new_address ADMIN 20000000000000

direnv allow
