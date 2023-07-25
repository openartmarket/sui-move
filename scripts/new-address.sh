server=$(sui client new-address ed25519 --json)

echo SUI_PHRASE=\"$(echo $server | jq -r '.[1]')\"
echo SUI_ADDRESS=\"$(echo $server | jq -r '.[0]')\"
