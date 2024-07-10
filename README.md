# UNS App V3

> Based on ENS App V3

## EXTERNAL CONTRIBUTOR NOTICE

**Please note that everything within this repo is currently in alpha. Some contracts are not yet deployed on mainnet which means some functionality may break on the network.**

## Usage

### Quick start

> **Important:** make sure you have all the dependencies required for `canvas`. You can find the instructions per OS on how to install these in the README of [`canvas`](https://www.npmjs.com/package/canvas).

```bash
pnpm install
pnpm dev:glocal
```

### Install

```bash
pnpm install
```

### Running Dev Server

```bash
# For mainnet
pnpm dev

# Or with the test environment running
pnpm dev:glocal
```

### Lint

```bash
pnpm lint
```

### Unit Test

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

We recommend installing [this](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) vscode plugin for a better unit testing experience.

### Test Environment

You must have [Docker](https://docs.docker.com/get-docker/) installed to run the test environment.
For more information on the environment, see [ens-test-env](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/).

Once installed, you can run:

```bash
pnpm denv
```

#### **If you need to deploy a new subgraph**

You shouldn't deploy the subgraph on top of the existing dataset, instead you should create a clean dataset (explained below).

1. Start the test environment

```bash
pnpm denv --save
```

2. Deploy the subgraph

After the deploy scripts have run, you can deploy the subgraph. Assuming you are in the [uns-subgraph](https://github.com/universal-everything/service-uns-subgraph) repo, you can use:

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

## Testing philosophy

Our testing philosophy is user-centric, meaning we want to write out tests so that they resemble the way a user would use our app as much as possible. We've borrowed this from the excellent [testing-library](https://testing-library.com/docs/guiding-principles/).

A user generally clicks, types and swipes, and so most tests should include one of these actions. A user may also load a page in a specific state (by clicking, typing or swiping outside of the app) so sometimes we just want to check a page renders correctly. The vast majority of our tests will be of these kinds.

For deeper parts of the codebase that aren't directly related to a user interaction, such as utility functions, the user is the developer. So simply test the code in the way a developer would use it.

We also primarily test for functionality, making sure the user is able to complete any action that we intend for them to be able to complete. This means we wouldn't write tests to ensure an animation occurs, as that would not stop a user completing an action, and would likely be picked up during the course of development.

Writing out todo tests before implementing a test can help. If I want my form to submit the correct data when I click submit, then I should write `it.todo('should submit the correct data when submit is clicked')` before starting. This will prevent me from testing implementation details as I write out the component.
