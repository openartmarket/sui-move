# Contributing

We would love for the community to review and improve our code. If you are interested in contributing, please read our [contributing guidelines]

## Development

To get started with development, run the following commands:
```sh
./scripts/bootstrap.sh
```
This command will install the dependencies of this project.

## Testing
Run the test suite, two terminals are required:

Terminal 1 - run the SUI node
```sh
rm ~/.sui -rf
sui start
```

Terminal 2 - deploy the contracts, and write environment variables for tests
```sh
./scripts/setup-oam-on-local-node.sh
```

When this is done, you are ready to run the tests:
```sh
direnv allow
npm test
```