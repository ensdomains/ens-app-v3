# ENS App V3

Version 3 of the ENS app.

## Default Settings

- [Yarn2 with PnP](https://yarnpkg.com/)
- [NextJS](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) (coverage 100%)
- [Cypress](https://www.cypress.io/)
- [ESLint](https://eslint.org/) with [airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript) rules
- [Github Actions](https://github.com/features/actions) (Coverage, E2E)
- Using [Husky](https://typicode.github.io/husky/#/)
  - Auto update patch version before commit
  - Check Lint, Coverage, E2E before push

## Usage

### Install

**For the moment, you should have the [@ensdomains/thorin](https://github.com/ensdomains/thorin) repo cloned locally in the same parent directory as this.**

#### Install yalc globally

```bash
npm i -g yalc
```

#### Locally publish thorin and update (not required)

```bash
cd ../thorin
yarn publish:local
```

```bash
yarn && yarn postinstall
```

### Running Dev Server

```bash
yarn dev
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

### E2E Test

For more information on the testing environment used, see the [test-environment's README](https://github.com/ensdomains/ens-app-v3/tree/main/test-environment).

```bash
# If you don't have an archive loaded in, run this first
yarn env:load

# Then you can run the respective e2e command
# For most circumstances
yarn e2e
# For if your docker instance requires root access
yarn e2e:root
# For if you're running CI or want to only run one command for tests
yarn e2e:ci
```

### Build and Export

```bash
yarn build
yarn start
yarn export
```

## PR builds

Vercel will automatically build and deploy a test site when pushed to a new PR branch.