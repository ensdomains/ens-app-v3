# ENS App V3

The all new, all cool version of the ENS manager.

## EXTERNAL CONTRIBUTOR NOTICE

**Please note that everything within this repo is currently in alpha, and should only be run on local nodes or testnets.**
**Any PR submitted may not be responded to for a while, since we are very actively implementing features.**

## Usage

### Quick start

```bash
yarn
yarn env start
yarn dev:glocal
```

Set your browser to ropsten

### Install

```bash
yarn && yarn postinstall
```

### Running Dev Server

```bash
yarn dev

# Or with local provider set
yarn dev:glocal
```

### Lint

```bash
yarn lint
```

### Unit Test

```bash
yarn test
yarn test:watch
yarn test:coverage
```

We recommend installing [this](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) vscode plugin for a better unit testing experience.

### Test Environment

1. Create a local env file from the example:

```bash
cp .env.local.example .env.local
```

2. Add archive node URL to env file

3. Starting the environment:

```bash
yarn env start
```

For more information on the testing environment used, see [ens-test-env](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/).

### E2E Testing

**Note: You don't need to run the test environment command. It is all handled in the e2e script.**

```bash
yarn e2e
```

### Building and Starting

```bash
yarn build
yarn start

# Or with local provider set
yarn build:glocal
yarn buildandstart:glocal
```

## PR builds

Vercel will automatically build and deploy a test site when pushed to a new PR branch.

## External Package Local Development

1. Install yalc globally:

```bash
npm i -g yalc
```

2. Run relevant update script within external repo, for example:

```bash
# Example publish script for ENSjs, be aware this may have changed.
yarn publish:local:ensjs
```

3. Run yarn within this repo:

```bash
yarn
```

## Architecture

The strcutre of the `pages` folder is mimicked inside `components`. Components specific to a page can be found in the the `components` folder, in the folder corresponding to that page.

Components that are used in multiple places will be found in the top level of the `components` folder.
