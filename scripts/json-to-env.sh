#!/bin/bash
json=$(cat output/contract.json)
touch .envrc
# Iterate over the keys
keys=$(echo "$json" | jq -r 'keys[]')
for key in $keys; do
  # Get the value for the current key
  value=$(echo "$json" | jq -r ".$key")

  # Export the environment variable
  echo "export $key=\"$value\"" >> .envrc
done

cat .envrc | bash