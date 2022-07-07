# ENS App V3

The all new, all cool version of the ENS manager.

## EXTERNAL CONTRIBUTOR NOTICE

**Please note that everything within this repo is currently in alpha, and should only be run on local nodes or testnets.**

## Usage

### Quick start

```bash
yarn
yarn dev:gonline
```

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

```bash
FORK_RPC_URL=http://example.com
```

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

## Testing philosophy

Our testing philiosphy is user-centric, meaning we want to write out tests so that they resemble the way a user would use our app as much as possible. We've borrowed this from the excellent [testing-library](https://testing-library.com/docs/guiding-principles/).

A user generally clicks, types and swipes, and so most tests should include one of these actions. A user may also load a page in a specific state (by clicking, typing or swiping outside of the app) so sometimes we just want to check a page renders correctly. The vast majority of our tests will be of these kinds.

For deeper parts of the codebase that aren't directly related to a user interaction, such as utility functions, the user is the developer. So simply test the code in the way a developer would use it.

We also primarily test for functionality, making sure the user is able to complete any action that we intend for them to be able to complete. This means we wouldn't write tests to ensure an animation occurs, as that would not stop a user completing an action, and would likely be picked up during the course of development.

Writing out todo tests before implementing a test can help. If I want my form to submit the correct data when I click submit, then I should write `it.todo('should submit the correct data when submit is clicked')` before starting. This will prevent me from testing implementation details as I write out the component.
