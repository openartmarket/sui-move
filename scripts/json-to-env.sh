#!/bin/bash
json=$(cat output/contract.json)
touch .envrc
# Iterate over the keys
keys=$(echo "$json" | jq 'keys[]')
for key in $keys; do
  # Get the value for the current key
  value=$(echo "$json" | jq -r ".$key")

  # Export the environment variable
  echo "$key=\"$value\"" >> .envrc
done

source .envrc