# Contributing

We would love for the community to review and improve our code. If you are interested in contributing, please read our [contributing guidelines]

## Development
To get started with development, run the following commands:

#### Install dependencies of the project
```sh
./scripts/bootstrap.sh
```
This command will install the dependencies of this project.

## Testing the contracts
Run the test suite, two terminals are required:

`Terminal 1` - run the SUI node
```sh
rm ~/.sui -rf
sui start
```

`Terminal 2` - deploy the contracts, and write environment variables for tests
```sh
./scripts/setup-oam-on-local-node.sh
```

When this is done, you are ready to run the tests, in the same terminal run:
```sh
npm test
```

## Coding practices
1. We use tests to verify the code works as expected.
2. We use [prettier] to format the code.
3. We use [eslint] to check for common errors.
4. We need to get a test-coverage tool, so we know that we have test all the permutations of the code.


### Formatting

The code is autoformatted when running this command

```sh
npm run format
```

### Linting

The code is linted when running this command

```sh
npm run lint
```

### Compile

The code is compiled when running this command

```sh
npm run compile
```

## To contribute code changes to this code
Please create a pull request with your changes and we will review it as soon as possible.
