# The ENS Manager App (V3)

# Quick start

Install [pnpm](https://pnpm.io/installation), then:

```bash
pnpm install
pnpm dev
```

Navigate to [localhost:3000](http://localhost:3000)

# Table of contents

<b>1.</b> [Why does this app exist?](#why-does-this-app-exist)  
&nbsp;&nbsp;<b>1.1</b> [Brief intro to ENS](#brief-into-to-ens)  
<b>2.</b> [Coming from non-blockchain web development (web2)](#why-does-this-app-exist)  
<b>3.</b> [Architecture](#architecture)

# Why does this app exist?

The puspose of the manager app is to expose the functionality of the ENS protocol in a user
friendly manor.

## Brief intro to ENS

ENS is a decentralised naming system that runs on the ethereum blockchain.
The main purpose of ENS is to convert unfriendly blockchain addresses
into human readable names (e.g. 0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5 -> nick.eth),
but ENS has grown into so much more than that. For more info please visit our
[docs site](https://docs.ens.domains/learn/protocol).

# Coming from web2

Web3 is the term used to describe the blockchain enabled web, web2 is the 'legacy' more
centralised web.
Much of this app is built in tech that will be familiar to many web2 devs.

<b>Web2 tech</b>

- [Typescript - Language](https://www.typescriptlang.org/)
- [React - Rendering library](https://react.dev/)
- [NextJS - Web Framework](https://react.dev/)
- [Tanstack query - State management](https://tanstack.com/query/latest)
- [Immer - State management]()
- [ts-pattern]()
- [Styled Components - Styling library]()
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

### Viem

Viem helps us to interact with the blockchain in a way that is typesafe.

### The Graph

### Anvil

# Architecture

## High level overview

![High level architecture diagram](./Manager%20App%20Architecture%20sans%20links.drawio.png)

## CI/CD

## [The Manager App](https://app.ens.domains/)

### Hosting

### Major dependencies

#### [Ens.js](https://github.com/ensdomains/ensjs-v3)

Much of the logic around interacting with the ENS contracts has been extraced into this
library. This is mostly so that we can help to make the experience of interacting with
ENS as simple as possible for other developers.

#### [Thorin](https://github.com/ensdomains/thorin)

As we have many different applications, and also would like to support the community, we
have developed a design system in order to ensure consistent styling across the board.

### Application Architecture

#### Pages and components

Pages folder has basic route layout and basic react needed for rendering pages. These
files should be kept relatively simple

Components that pages consume are kept in the components folder. This folder has a strucutre
that mimicks the strucutre of the pages folder. If a component is only used on a specific page
then it goes into the corresponding folder in the components folder.

If a component is used across multiple pages and other components,
then it goes into the `atoms` and `molecules` folder (link to atoms and molecules thingy).

#### Transactions

#### Transaction store

Transaction store is responsbile for keeping track of the state of transactions. It is
mostly used by our transaction flow abstraction described next.

#### Transaction flow

`createTransactionFlow`
src/transaction-flow/

intro

input

transaction

Let's walk through a transaction flow that requires multiple steps as this will touch
every part of the transaction flow abstraction.

1.import page
2.dns claim component 3.

#### Sync Provider

This is for when the graph is behind and we are waiting for it to catchup

#### Syncing dropped transactions

#### Notification system

### Metadata service

https://metadata.ens.domains/

- https://metadata.ens.domains/docs
- https://github.com/ensdomains/ens-metadata-service

#### Cloudflare workers

avatar-upload

- https://avatar-upload.ens-cf.workers.dev/
- https://github.com/ensdomains/ens-avatar-worker

gas-estimate-worker

- https://gas-estimate-worker.ens-cf.workers.dev/
- https://github.com/ensdomains/gas-estimate-worker

app-v3-maintenance

- https://app-v3-maintenance.ens-cf.workers.dev/

moonpay-worker

- https://moonpay-worker.ens-cf.workers.dev/
- https://github.com/ensdomains/moonpay-worker

etherscan-api worker

- https://etherscan-api.ens-cf.workers.dev/

dotbox-worker

#### Data indexing

The graph hosted service

- https://api.thegraph.com/subgraphs/name/ensdomains/ens/graphql
- https://github.com/ensdomains/ens-subgraph

### Test Environment

You must have [Docker](https://docs.docker.com/get-docker/) installed to run the test environment.
For more information on the environment, see [ens-test-env](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/).

Once installed, you can run:

```bash
pnpm denv
```

### Running Dev Server

```bash
# For mainnet
pnpm dev

# Or with the test environment running
pnpm dev:glocal
```

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

## Architecture

The structure of the `pages` folder is mimicked inside `components`. Components specific to a page can be found in the the `components` folder, in the folder corresponding to that page.

Components that are used in multiple places will be found in the top level of the `components` folder.

## Coding standards

- `any` is strictly prohibited
- Prefer small functions that do one thing.
- Most business logic should be outside of hooks, e.g. useEffect, useQuery etc is just there
  to manage react rendering and should be small, most of the logic should be in pure functions

## Testing philosophy

Our testing philosophy is user-centric, meaning we want to write out tests so that they resemble the way a user would use our app as much as possible. We've borrowed this from the excellent [testing-library](https://testing-library.com/docs/guiding-principles/).

A user generally clicks, types and swipes, and so most tests should include one of these actions. A user may also load a page in a specific state (by clicking, typing or swiping outside of the app) so sometimes we just want to check a page renders correctly. The vast majority of our tests will be of these kinds.

For deeper parts of the codebase that aren't directly related to a user interaction, such as utility functions, the user is the developer. So simply test the code in the way a developer would use it.

We also primarily test for functionality, making sure the user is able to complete any action that we intend for them to be able to complete. This means we wouldn't write tests to ensure an animation occurs, as that would not stop a user completing an action, and would likely be picked up during the course of development.
