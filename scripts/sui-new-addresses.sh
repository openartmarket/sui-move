#!/usr/bin/env bash
set -euo pipefail

original_address=$(sui client active-address)
envs=$(sui client active-env)

if [[ $envs != *"localnet"* ]]; then
  sui client switch --env localnet
fi

gas=$(sui client gas --json)
gas_object=$(echo $gas | jq -r '.[0].id.id')

rm -f .sui-addresses.env

function new_address() {
  name=$1
  address_json=$(sui client new-address ed25519 --json)
  address=$(echo $address_json | jq -r '.[0]')
  phrase=$(echo $address_json | jq -r '.[1]')
  sui client transfer-sui --amount 20000000000000 --to "$address" --gas-budget 200000000 --sui-coin-object-id "$gas_object"
  echo "export ${name}_ADDRESS=\"$address\"" >> .sui-addresses.env
  echo "export ${name}_PHRASE=\"$phrase\"" >> .sui-addresses.env
}

new_address ADMIN
new_address USER1
new_address USER2
new_address USER3

direnv allow