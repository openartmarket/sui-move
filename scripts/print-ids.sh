#!/usr/bin/env bash

stdin=$(cat)
# echo "${stdin}"

echo PACKAGE_ID=$(echo "${stdin}" | jq -r '.effects.created[] | select(.owner == "Immutable").reference.objectId')
newObjs=$(echo "${stdin}" | jq -r '.objectChanges[] | select(.type == "created")')
echo ADMIN_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::open_art_market::AdminCap")).objectId')
echo PUBLISHER_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::Publisher")).objectId')
echo UPGRADE_CAP_ID=$(echo "$newObjs" | jq -r 'select (.objectType | contains("::package::UpgradeCap")).objectId')
