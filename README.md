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

Much of the logic around interacting with the ENS contracts has been extracted into this
library. This is mostly so that we can help to make the experience of interacting with
ENS as simple as possible for other developers.

#### [Thorin](https://github.com/ensdomains/thorin)

As we have many different applications, and also would like to support the community, we
have developed a design system in order to ensure consistent styling across the board.

### Application Architecture: Key files and concepts

#### Pages and components

Pages folder has basic route layout and basic react needed for rendering pages. These
files should be kept relatively simple

Components that pages consume are kept in the components folder. This folder has a structure
that mimics the structure of the pages folder. If a component is only used on a specific page
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

#### Stateless vs Stateful

Our e2e tests are split into two categories, stateless and stateful. Stateless test use the development environment, are faster, and is the general recommended way to write integration tests. Occasionally, you may need to test a feature that requires an external API or service. In this case, you can use the stateful tests. These tests are slower, 

#### Running the tests

Running the entire stateless test suite:

```bash
pnpm denv
pnpm dev:glocal
pnpm e2e
```

Running a single test within a browser:

```bash
pnpm denv
pnpm dev:glocal
pnpm e2e < filename >:< linenumber > --headed
```

Running the entire stateful test suite:

```bash
pnpm dev
pnpm e2e:stateful
```

Running a single stateful test within a browser:

```bash
pnpm dev
pnpm e2e:stateful < filename >:< linenumber > --headed
```

#### makeName

The most important function in the e2e stateless tests is `makeName`. This function is used to create a unique name for each test. This is important because we want to avoid any conflicts between tests.

##### Syntax

```typescript
  const name = await makeName({
    label: 'name',
    type: 'legacy',
    owner: '0x1234567890123456789012345678901234567890',
    manager: '0x1234567890123456789012345678901234567890',
    resolver: '0x1234567890123456789012345678901234567890',
    records: {
      texts: [{
        key: 'text',
        value: 'value'
      }],
      coins: [{
        coin: 'eth',
        value: '0x1234567890123456789012345678901234567890'
      }],
      contentHash: 'bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
      abi: await encodeAbi({ encodeAs: 'cbor', data: { test2: 'test2' } }),
    }
    subnames: [{
      label: 'subname',
      type: 'wrapped',
      owner: '0x1234567890123456789012345678901234567890',
      duration: 365,
      resolver: '0x1234567890123456789012345678901234567890',
      records: [{
        key: 'text',
        value: 'value'
      }]
    }]
  })
```

##### Parameters

###### nameOrNames

A single or an array of names to create. Each name can have the following properties:

**label**: *string*

The label of the name.

**type**: legacy | legacy-register | wrapped*

The type of the name. *legacy* names adopt the original data structure of ENS and are not ERC1155 complaint. *wrapped* names are names that have been wrapped with the *NameWrapper* contract and are ERC1155 compliant. *legacy-register* names simulate how mass registration services register names, usually without a resolver of other options that may increase gas.

**owner**: *user | user2 | user3*

*defaults to owner*

The address of the owner of the name.

**manager**: *user | user2 | user3*

*defaults to value of owner*

The address of the manager of the name. Only applicable to *legacy* and *legacy-registr* names. 

**duration**: *number*

*defaults to 365 days in seconds*

The number of seconds the name will be registered for. Negative values are allowed to simulate names that have expired or are in the grace period.

**secret**: *hex*

*defaults to a zero hex*

The secret used during the register process. You will most likely not need to set this value.

**resolver**: *address*

*defaults to the legacy resolver for legacy names and the latest resolver for wrapped names*

The address of the resolver for the name. Used to test cases where the resolver is misconfgured or not set.

**addr**: *address*

*defaults to the address of the owner*

The address record for the name. Is used to test cases where the eth address is not set.

**records**: *RecordOptions*

The records for the name. Below is a type definition for the records object.

```typescript
type RecordOptions = {
  texts: {
    key: string,
    value: string
  }[]
  coins: {
    coin: string | number,
    value: string
  }[]
  contentHash: string
  abi: AbiObject
}
```

**fuses**: *FusesType*

*applicable to wrapped names only*

The fuses to burn for a wrapped name. Below is a type definition for the fuses object. Note that *PARENT_CANNOT_CONTROL* is not fuse option as it is burned by default when a 2LD name is wrapped.

```typescript
type FusesType = {
  named: Array<"CANNOT_UNWRAP" | "CANNOT_BURN_FUSES" | "CANNOT_TRANSFER" | "CANNOT_SET_RESOLVER" | "CANNOT_SET_TTL" | "CANNOT_CREATE_SUBDOMAIN" | "CANNOT_APPROVE">
}
```

**subnames**: *SubnameType[]*

The subnames for the name. Below is a type definition for the subname object.

```typescript
type SubnameType = {
  label: string
  type: 'legacy' | 'wrapped'
  resolver: string
  records: RecordOptions
  duration: number
  subnames: SubnameType[]
  fuses: FusesType // Only applicable to wrapped names
}
```

###### options

**timeOffset**: *number*

*defaults to 0*

The duration in seconds to move the blockchain forward after the name has been registered. In rare use cases, usually when you are testing a name with a negative duration, the blockchain may need to be moved forward after all the transactions before it will resolve correctly.

**syncSubgraph**: *boolean*

*defaults to true*

Whether to wait for the subgraph to sync before returning the name. It is useful to set this value to false when you are testing a feature that does not rely on the subgraph to speed up the tests.

##### Returns

Returns a string for the 2LD name that is made up of the label with a timestamp appended to it and .eth TLD. The appended timestamp ensures that each time that a name is generated that it is unique.

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

2. Link a local package:

```bash
pnpm link ../ensjs
```

3. Run pnpm install within this repo:

```bash
pnpm install
```


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

## Knip Configuration Guide

### 1. Install Knip:

Install Knip as a development dependency in your project:

```bash
pnpm add -D knip
```

### 2. Add a knip script to your package.json:

Add a script to your package.json for easy access to Knip:

```json
{
  "scripts": {
    ...,
    "knip": "knip",
    "knip:fix": "knip --fix --allow-remove-files"
  }
}
```

### 3. Create Knip Configuration File:

Create a `knip.config.ts` file at the root of your project. For more detail of configuration options, refer to the [knip.config.ts file](knip.config.ts) in the ENSDomains repository.

### 4. Run Knip:

To analyze your project, run Knip using the following command:

```bash
pnpm knip
```
Knip will exit with code `1` if any issues are found, such as unused files, dependencies, or exports that need to be removed.

### 5. Review and Remove Unused Files

After Knip completes its analysis, review the results. Manually remove any unused files that are safe to delete, or let Knip handle it automatically with the following command:

```bash
pnpm knip:fix
```

Ensure you carefully examine any files marked for removal to avoid accidentally deleting necessary code.

### 6. Run Unit Tests and E2E Tests:

After removing files, it's important to run your unit and end-to-end tests to ensure that everything is still functioning correctly:

```bash
pnpm test:coverage
```

```bash
pnpm e2e
```
