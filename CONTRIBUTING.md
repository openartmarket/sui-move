# Contributing

This document describes how to contribute to the Open Art Market SUI Move contracts.

## Install dependencies

We use [asdf](https://github.com/asdf-vm/asdf) to install various command line tools.
Follow the [asdf installation instructions](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf) to install the `asdf` command.

Most of the required tools are defined in `.tool-versions`. To install them all, run this command:

    ./scripts/asdf-install.sh

The `sui` command line is not available in `asdf`. To install it, run this command:

    ./scripts/sui-install.sh

Finally, install the npm dependencies:

    npm install

## Configure `direnv`

We use `direnv` to manage environment variables.
Follow the [direnv setup instructions](https://direnv.net/docs/hook.html) to make sure `direnv` is loaded in your shell.

Check that `direnv` is working:

    echo $SUI_NETWORK

It should print `localnet`.

## Start a local sui node

    rm -rf ~/.sui
    sui start

This will start a local sui node.
Start a new shell for the following commands.

## (Optional) - run against Shinami

By default, the tests run against a local sui node, but if you define the environment variables below, the tests will run against the Shinami testnet.

Add the following to your `.sui.env` file:

```bash
export SHINAMI_ENABLED=1
# Copy the "SUI Testnet" access key from https://app.shinami.com/access-keys
export SHINAMI_ACCESS_KEY="..."
# Copy the SUI_TESTNET_* values from openartmarket/server/.envrc
export ADMIN_CAP_ID="..."
export PACKAGE_ID="..."
export ADMIN_ADDRESS="..."
export ADMIN_PHRASE="..."

export SHINAMI_ENABLED=1
export SHINAMI_ACCESS_KEY=sui_testnet_9694e6fec605d3b35dc72a85478437d4
export ADMIN_CAP_ID=0x9dee40d1a413c4b71874d35427ab7f1233d31f105e264cef395c6b51663824ae
export PACKAGE_ID=0xa8ab427eab83ad9e1a27b3263359176333c4fc4dbbd3b59adc76eb397828e0f6
export ADMIN_PHRASE="candy reason mammal garden choose price sense sad animal admit try cross"

```

## Create sui addresses (accounts)

We'll create an admin address (for contract deployment) and three regular addresses (for testing).

    ./scripts/sui-new-addresses.sh

This should create a new (`.gitignore`d) file called `.sui.env` which will be used by tests.

## Deploy the contracts

    ./scripts/publish-contracts.sh

This will append more environment variables to `.sui.env` which will be used by tests.

## Test the contracts

Now that the contracts are deployed, run the tests:

    npm test

You can rerun tests without redeploying the contracts. Just run `npm test` again.

### Running a single test

While you're developing, you may want to run only the single test you're working with.

Change `it('...')` to `it.only('...')`, and `npm test` will *only* run that test.

### Viewing on local blockchain explorer

Go to [SUI Explorer](https://suiexplorer.com/?network=local)

## Coding practices

1. We use tests to verify the code works as expected.
2. We use prettier to format the code.
3. We use eslint to check for common errors.

### Compile

The TypeScript code is compiled to JavaScript (esm and cjs) with the following command:

    npm run build

## Contributing changes

Please open a pull request with your changes and we will review it as soon as possible.
