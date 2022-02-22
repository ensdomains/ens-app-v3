# Testing Environment

## How it works

The testing environment used here is implemented in the stateless and stateful tests for ENS app.
The environment consists of two parts: the hardhat Ethereum node, and the docker graph instance.
Which environment type you use is dependent on your testing circumstances.

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

Contract deployments are a small but neccessary part of testing ENS app, you can deploy contracts to
both stateless and stateful environments. After the locally tested contract is deployment, the
deployment script should be left in the repo to serve as an archive.

## Updating the graph-node dataset

To update the graph-node dataset, the BLOCK_HEIGHT variable must be changed within the `.env` file.

If the dataset is a dependency for a local test, you will need to first let your local graph-node
dataset update so that your test can pass. Once this is done you can push your changes to github
where an action will be activated to create the new dataset for others to use.

### Dataset naming scheme

```js
`data_${BLOCK_HEIGHT}_${SUBGRAPH_ID}_${EPOCH_TIME}.archive`;
// e.g. data_14119046_QmTmU4syjQb8gfNq8TCQGv441qp2zQMNKnQ4smjKhpLQ6F_1643850493.archive.zip
```
