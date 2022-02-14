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

```bash
yarn cypress
yarn cypress:headless
yarn e2e
yarn e2e:headless
```

### Build and Export

```bash
yarn build
yarn start
yarn export
```
