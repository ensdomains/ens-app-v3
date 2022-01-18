module.exports = {
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.yarn/**",
    "!**/.next/**",
    "!**/cypress",
  ],
  testMatch: [
    "<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)",
    "<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    "^__tests__/(.*)$": "<rootDir>/__tests__/$1",
    "^pages/(.*)$": "<rootDir>/pages/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "jest-plugin-context/setup"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.yarn/",
    "<rootDir>/.next/",
    "<rootDir>/cypress/",
  ],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
    "^.+\\.(md|mdx)$": "jest-transformer-mdx/cra",
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "/.yarn/",
    "/.next/",
    "^.+\\.module\\.(css|sass|scss)$",
    "cypress",
    ".storybook",

    "config.js",
    "coverage",

    "_document.tsx",
    "_app.tsx",
    "_error.tsx",
    "404.tsx",
    "500.tsx",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.yarn/",
    "/.next/",
    "^.+\\.module\\.(css|sass|scss)$",
    "cypress",
    ".storybook",

    ".config.",
    "coverage",
    "/stories/",

    "_document.tsx",
    "_app.tsx",
    "_error.tsx",
    "404.tsx",
    "500.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
