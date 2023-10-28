#!/usr/bin/env bash
set -e

network=${SUI_NETWORK:-localnet}
SUI_URL="https://fullnode.$network.sui.io:443"

echo "👉 Switching to $network on $SUI_URL"

# Add the environment if it doesn't exist
list=$(sui client envs)
if echo "$list" | grep -qz "$network"; then
  echo "🌐 $network already in client"
else
  sui client new-env --alias "$network" --rpc "$SUI_URL"
  echo "🌐 $network added to sui client"
fi

# Switch to enviroment if not active
envs=$(sui client active-env)
if [[ $envs != *"$network"* ]]; then
  sui client switch --env "$network"
fi

active_env=$(sui client active-env)
echo "🌐 $active_env active"