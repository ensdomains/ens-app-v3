# The ENS Manager App (V3)

# Quick start

Install [pnpm](https://pnpm.io/installation), then:

```bash
pnpm install
pnpm dev
```

Navigate to [localhost:3000](http://localhost:3000)

# Why does this app exist?

The purpose of the manager app is to expose the functionality of the ENS protocol in a user
friendly manor.

## Brief intro to ENS

ENS is a decentralized naming system that runs on the ethereum blockchain.
The main purpose of ENS is to convert unfriendly blockchain addresses
into human readable names (e.g. 0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5 -> nick.eth),
but ENS has grown into so much more than that. For more info please visit our
[docs site](https://docs.ens.domains/learn/protocol).

# Coming from web2

Web3 is the term used to describe the blockchain enabled web, web2 is the 'legacy' more
centralized web.
Much of this app is built in tech that will be familiar to many web2 devs.

<b>Web2 tech</b>

- [Typescript - Language](https://www.typescriptlang.org/)
- [React - Rendering library](https://react.dev/)
- [NextJS - Web Framework](https://react.dev/)
- [Tanstack query - State management](https://tanstack.com/query/latest)
- [Immer - State management/Functional programming helper](https://immerjs.github.io/immer/)
- [ts-pattern - Functional programming helper](https://github.com/gvergnaud/ts-pattern)
- [Styled Components - Styling library](https://styled-components.com/)
- [Cloudflare pages - Hosting](https://pages.cloudflare.com/)
- [Cloudflare functions - Server side functionality](https://developers.cloudflare.com/pages/functions/)
- [Github Actions - CI/CD](https://docs.github.com/en/actions)
- [Docker - Test environment](https://www.docker.com/)
- [Playwright - Integration tests](https://playwright.dev/)
- [Vitest - Unit tests](https://vitest.dev/)

<b>Web3 tech</b>

- [Infura - Ethereum node provider](https://www.infura.io/)
- [Viem - Blockchain interaction](https://viem.sh/)
- [The Graph - GraphQL interface for Blockchain info](https://thegraph.com/docs/en/)
- [IPFS - Distributed file hosting](https://ipfs.tech/)
- [Anvil - Local Blockchain for testing](https://github.com/foundry-rs/foundry/tree/master/crates/anvil)

## Explaining the web3 parts

TBC

## Setting up the development environment

You must have [Docker](https://docs.docker.com/get-docker/) installed to run the test environment.
For more information on the environment, see [ens-test-env](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/).

Once installed, you can run:

```bash
pnpm denv
pnpm dev:glocal
```

You can now navigate to `http://localhost:3000` to see the app running off of a
local blockchain.

You will need a browser wallet to develop and test blockchain interactions.
Download the Metamask browser extension [here](https://metamask.io/download/).

During the setup flow choose "Import existing wallet".

When it asks for your "Secret recovery phrase", use
`test test test test test test test test test test test junk`

You can then follow the instructions [here](https://support.metamask.io/managing-my-wallet/using-metamask/using-a-local-node/)
to connect metamask to our local dev blockchain.

You should now have 10,000 ETH (local network eth) in your wallet.
You're a legend on your local machine.

# Architecture

## High level overview

![High level architecture diagram](./Manager%20App%20Architecture%20sans%20links.drawio.png)

## CI/CD

Github action scripts can be found in `.github/workflows`

## [The Manager App](https://app.ens.domains/)

### Hosting

The App is hosted on cloudflare and IPFS

### Major dependencies

#### [Ens.js](https://github.com/ensdomains/ensjs-v3)

Much of the logic around interacting with the ENS contracts has been extraced into this
library. This is mostly so that we can help to make the experience of interacting with
ENS as simple as possible for other developers.

#### [Thorin](https://github.com/ensdomains/thorin)

As we have many different applications, and also would like to support the community, we
have developed a design system in order to ensure consistent styling across the board.

### Application Architecture: Key files and concepts

#### Pages and components

Pages folder has basic route layout and basic react needed for rendering pages. These
files should be kept relatively simple

Components that pages consume are kept in the components folder. This folder has a strucutre
that mimicks the strucutre of the pages folder. If a component is only used on a specific page
then it goes into the corresponding folder in the components folder.

If a component is used across multiple pages and other components,
then it goes into the `atoms` and `molecules` folder (link to atoms and molecules thingy).

#### useQuery

TBC

#### Transactions

#### `TransactionStore.ts`

Transaction store is responsible for keeping track of the state of transactions.

#### `TransactionFlowProvider.ts`

We noticed transactions always follow a similar pattern and so created an internal API to
streamline this. A transaction flow is a series of steps that occur in a modal, culminating
in a successful or failed transaction. Transactions can have either an intro or an input step
before the transaction step.

#### Example of transaction with an input and multiple steps

- Switch to test account 1 (the second account).
- Go to 'My Names'
- Select `migrated-resolver-to-be-updated.eth`
- Click send
- The Modal that pops up is rendered by the `TransactionDialogManager`, which is rendered
  by `TransactionFlowProvider`. The logic for rendering the different steps is contained here.
- This button is in `RolesSection.tsx`, which gets its actions from `useRoleActions.tsx`.
  The `onClick` property here calls `showSendNameInput` from `usePreparedDataInput`.
  This is a helper function provided by the `useTransactionFlow` hook.
  We have various input components prepared already,
  they are defined in `src/transaction-flow/input`. This one is using `input/SendName`. Once the
  form data has been submitted we dispatch two actions to the `TransactionFlowProvider` reducer.
  One to set the transactions required, and the next one to advance to the next step of the
  transaction flow.
- Enter any address or ENS name that exists in the dev environment
- You should see a summary of changes, indicating the steps/transactions required
- Follow the steps through and complete the multiple transactions
- The code for managing the sending of transactions is in `TransactionStageModal`.

#### Sync Provider

This is for when the graph is behind and we are waiting for it to catchup.

#### Notification system

TBC

### Metadata service

ENS names are NFTs. NFTs can have metadata associated with them, that is
data associated with them that is not stored directly on-chain. One of the
main use cases of this is to display a nice image that represents the ENS
name. You can see an example of this [here](https://app.ens.domains/nick.eth?tab=more).

https://metadata.ens.domains/

- https://metadata.ens.domains/docs
- https://github.com/ensdomains/ens-metadata-service

#### Cloudflare workers

avatar-upload: [url](https://avatar-upload.ens-cf.workers.dev/),
[src](https://github.com/ensdomains/ens-avatar-worker)

gas-estimate-worker: [url](https://gas-estimate-worker.ens-cf.workers.dev/),
[src](https://github.com/ensdomains/gas-estimate-worker)

app-v3-maintenance: [url](https://app-v3-maintenance.ens-cf.workers.dev/)

moonpay-worker: [url](https://moonpay-worker.ens-cf.workers.dev/),
[src](https://github.com/ensdomains/moonpay-worker)

etherscan-api worker: [url](https://etherscan-api.ens-cf.workers.dev)

#### Data indexing

The graph hosted service: [url](https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql),
[src](https://github.com/ensdomains/ens-subgraph)

### Unit Test

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

#### **If you need to deploy a new subgraph**

You shouldn't deploy the subgraph on top of the existing dataset, instead you should create a clean dataset (explained below).

1. Start the test environment

```bash
pnpm denv --save
```

2. Deploy the subgraph

After the deploy scripts have run, you can deploy the subgraph. Assuming you are in the [ens-subgraph](https://github.com/ensdomains/ens-subgraph) repo, you can use:

```bash
yarn setup
```

3. Wait for the subgraph to sync

Similar to the update process, a good indicator of sync status is if you see this message:

```
no chain head update for 30 seconds, polling for update, component: BlockStream
```

Dissimilar to the update process however is that you will never need to mine blocks manually.

4. Exit the test environment

You can exit out of the test environment using `Ctrl+C`.

Once exited, you can commit the data to your branch. You do not need to run a separate save command.

### E2E Testing

**Note: You don't need to run the test environment command. It is all handled in the e2e script.**

```bash
pnpm e2e
```

### Building and Starting

```bash
pnpm build
pnpm start

# Or with the test environment running
pnpm build:glocal
pnpm buildandstart:glocal
```

### Debugging

To debug a single test:

```bash
pnpm denv
pnpm dev:glocal
pnpm playwright test --project=stateless --ui stateless/extendNames
```

## PR builds

Cloudflare will automatically build and deploy a test site when pushed to a new PR branch.

## External Package Local Development

1. Install yalc globally:

```bash
npm i -g yalc
```

2. Run relevant update script within external repo, for example:

```bash
# Example publish script for ENSjs, be aware this may have changed.
pnpm publish:local:ensjs
```

3. Run pnpm install within this repo:

```bash
pnpm install
```

If updating an existing yalc installation, you can add the `--force` flag.

## Coding guidelines

- `any` is strictly prohibited, tempting as it may be.
- Prefer small functions that do one thing.
- Most business logic should be outside of hooks, e.g. useEffect, useQuery etc is just there
  to manage react rendering and should be small, most of the logic should be in pure functions
- `ts-pattern` for conditionally rendering components when something more than a ternary
  expression is needed
- Critical pieces of logic should be unit tested

## Testing philosophy

Our testing philosophy is user-centric, meaning we want to write out tests so that they resemble the way a user would use our app as much as possible. We've borrowed this from the excellent [testing-library](https://testing-library.com/docs/guiding-principles/).

A user generally clicks, types and swipes, and so most tests should include one of these actions. A user may also load a page in a specific state (by clicking, typing or swiping outside of the app) so sometimes we just want to check a page renders correctly. The vast majority of our tests will be of these kinds.

For deeper parts of the codebase that aren't directly related to a user interaction, such as utility functions, the user is the developer. So simply test the code in the way a developer would use it.
