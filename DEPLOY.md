# Deploy Sui contracts

1. Address and Mnemonic Phrase that will be the deployer of the contracts.
2. Set the address as export `ADMIN_PHRASE` & `ADMIN_ADDRESS` in `.envrc`
3. Make sure the SUI_NETWORK is set to `mainnet` in `.envrc`
4. Run `direnv allow` to load the environment variables.
5. Run `./scripts/import-address.sh` to import the address to the local node and switch to it.
6. Check that you have gas, run `sui client gas`
7. Run `./scripts/publish-contracts.sh` to publish the contracts to the environment.
8. Look in `.envrc` for the addresses of the contracts.
