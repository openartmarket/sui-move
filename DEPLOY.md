# Deploy Sui contracts

1. You need an address and mnemonic phrase that will be the deployer of the contracts.
2. Set the address as `ADMIN_PHRASE` & `ADMIN_ADDRESS` in `.sui.env`
3. Make sure the SUI_NETWORK is set to `mainnet` in `.envrc`
4. Run `direnv allow` to load the environment variables.
5. Run `./scripts/utils/import-address.sh` to import the address to the local node and switch to it.
6. Check that you have gas, run `sui client gas`
7. Run `./scripts/publish-contracts.sh` to publish the contracts to the environment.
8. Look for published addresses in `.envrc` for the addresses of the contracts.
