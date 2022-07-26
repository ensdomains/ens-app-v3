# ens-test-env

## How it works

The testing environment used here is implemented in the stateless and stateful tests for ENS app.
The environment consists of two parts: the ganache Ethereum node, and the docker graph instance.
Which environment type you use is dependent on your testing circumstances.

## Configuration

There should be a file named `ens-test-env.config.js` in your project's root directory.
You can add a JSDoc type import to import the config type.

```js
/**
 * @type {import('@ensdomains/ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'yarn hardhat deploy',
  tenderly: {
    user: 'ens',
    project: 'core',
    key: 'tenderly-key',
  },
  archive: {
    subgraphId: 'QmXxAE7Urtv6TPa8o8XmPwLVQNbH6r35hRKHP63udTxTNa',
    epochTime: 1646894980,
    blockNumber: 12066620,
    baseUrl: 'https://storage.googleapis.com/ens-manager-build-data',
    network: 'mainnet',
  },
  docker: {
    file: './docker-compose.yml',
    sudo: false,
  },
  ethereum: {
    chain: {
      chainId: 0,
    },
    fork: {
      url: 'https://example.com',
    },
    wallet: {
      mnemonic: 'test test test test test test test test test test test junk',
      unlockedAccounts: ['0x0000000000000000000000000000000000000000'],
    },
    database: {
      dbPath: './ganache',
    },
  },
  graph: {
    bypassLocal: false,
  },
  scripts: [
    {
      command: 'example',
      name: 'example',
      prefixColor: 'blue.bold',
      cwd: path.resolve('./'),
      finishOnExit: true,
      waitForGraph: true,
    },
  ],
  paths: {
    archives: './archives',
    data: './data',
  },
}
```

## Environment Types

### Stateless

For most testing sitatutions you can use the default settings, which will create a fresh mainnet
fork from a specified block as well as deploying a fresh subgraph with the same specified block
as it's start block.

Tests should ideally be designed to be stateless where possible, which entails not using hardcoded
addresses and not relying on any specific blockchain/graph state. This allows for a much higher
test reliability and low maintenance.

### Stateful

Some tests may require a specific existing state, for example if a test relies on an old deployment
of a contract which can no longer be accurately replicated from a fresh mainnet fork. The stateful
environment uses pre-existing subgraph data at a specified block to allow full state access prior
to the mainnet fork.

The stateful environment can also be used to more closely replicate a production environment for
true full end-to-end tests. You may also want to use this environment for testing with your own
personal wallet without using mainnet.

The downside of using the stateful environment is that a test can potentially become unreliable if
one of it's dependencies changes. Alongside reliability, running a stateful test most of the time
will require access to a specific private key. Given this, you should try to avoid writing stateful
tests wherever possible.

## Contract deployments

Contract deployments are a small but neccessary part of testing, you can deploy contracts to
both stateless and stateful environments. After the locally tested contract is deployed, the
deployment script should be left in the repo to serve as an archive.

## Updating the graph-node dataset

Generally, you will want to set a graft variable in the `subgraph.yaml` file for the subgraph. You
can find more about the ENS subgraph [here](https://github.com/ensdomains/ens-subgraph). You'll also
documentation for grafting available [here](https://thegraph.com/docs/en/developer/create-subgraph-hosted/#grafting-onto-existing-subgraphs).

To update the graph-node dataset, the BLOCK_HEIGHT variable must be changed within the `.env` file.
It should be set to the same value as the graft block.

If the dataset is a dependency for a local test, you will need to first let your local graph-node
dataset update so that your test can pass.

Once your data is up to date, you can run

```bash
yarn ens-test-env data --compress
```

in this directory, which will give you a archive file for your dataset.

### Dataset naming scheme

```js
const file = `data_${BLOCK_HEIGHT}_${SUBGRAPH_ID}_${EPOCH_TIME}_${NETWORK}.archive`
// e.g. data_14119046_QmTmU4syjQb8gfNq8TCQGv441qp2zQMNKnQ4smjKhpLQ6F_1643850493_ropsten.archive.tar.lz4
```

## Running the environment

After this you can run:

```bash
# Start
yarn ens-test-env start
# Load data only
yarn ens-test-env data --load
# Export generated data
yarn ens-test-env data --compress
```
