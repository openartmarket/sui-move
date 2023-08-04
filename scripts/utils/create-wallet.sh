#!/usr/bin/env bash
set -e

name=${1:-USER}
output=${2:-env}

wallet=$(sui client new-address ed25519 --json)

if [ "$output" == "env" ]; then
  echo 'export '$name'_ADDRESS='$(echo $wallet | jq -r ".[0]") >> .envrc
  echo 'export '$name'_PHRASE="'$(echo $wallet | jq -r ".[1]")'"' >> .envrc
  direnv allow
else
  echo "{ \"address\": \"$(echo $wallet | jq -r '.[0]')\", \"phrase\": \"$(echo $wallet | jq -r '.[1]')\" }"
fi


