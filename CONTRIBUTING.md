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

    npm run clean
    sui start

This will start a local sui node.
Start a new shell for the following commands.

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

### Formatting

The code is autoformatted when running this command
Configuration for the formatter is in the `.prettierrc` file

    npm run format

### Linting

The code is linted for warnings and errors when running this command
Configuration for the linter is in the `.eslintrc.json` file

    npm run lint

### Compile

The TypeScript code is compiled to JavaScript (esm and cjs) with the following command:

    npm run build

## Contributing changes

Please open a pull request with your changes and we will review it as soon as possible.
