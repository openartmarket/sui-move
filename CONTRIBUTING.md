# Contributing

We would love for the community to review and improve our code. If you are interested in contributing, please read our [contributing guidelines]

## Development
To get started with development, run the following commands:


## Local environment

### Option 1: Run a local sui node

#### Install dependencies of the project
Install dependencies of the project and run sui locally

```sh
./scripts/bootstrap.sh
```
This command will install the dependencies of this project.

Run the test suite, two shells are required:

`shell 1` - run the SUI node
```sh
rm -rf ~/.sui
sui start
```

`shell 2` - deploy the contracts, and write environment variables for tests
```sh
./scripts/setup-oam-on-local-node.sh
./scripts/json-to-env.sh
direnv allow
npm run create:artwork-display
npm run create:artwork-shard-display

```

### Option 2: Run tests against a docker container
Run it as we do in CI, in a Docker container, two shells are required:

`shell 1` - run the SUI node
```sh
docker compose up
```
`shell 2` - deploy the contracts, and write environment variables for tests
```sh
./scripts/json-to-env.sh
direnv allow
cd setup
npm run create:artwork-display
npm run create:artwork-shard-display
```

## Testing the contracts

When you have setup local environment, you are ready to run the tests, in the shell 2 run:

```sh
npm test
```
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
4. We need to get a test-coverage tool, so we know that we have test all the permutations of the code.


### Formatting

The code is autoformatted when running this command
Configuration for the formatter is in the `.prettierrc` file

```sh
npm run format
```

### Linting

The code is linted for warnings and errors when running this command
Configuration for the linter is in the `.eslintrc.json` file

```sh
npm run lint
```

### Compile

The code is compiled when running this command
We compile the code for both cjs and esm modules

```sh
npm run compile
```

## To contribute code changes to this code
Please create a pull request with your changes and we will review it as soon as possible.
