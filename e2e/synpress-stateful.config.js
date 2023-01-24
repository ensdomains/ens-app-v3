const { defineConfig } = require('cypress')
const importedSetupNodeEvents = require(`${getSynpressPath()}/plugins/index`)
const fixturesFolder = `${getSynpressPath()}/fixtures`

module.exports = defineConfig({
  projectId: '4zmgdz',
  userAgent: 'synpress',
  retries: {
    runMode: process.env.CI ? 3 : 0,
    openMode: 0,
  },
  fixturesFolder,
  screenshotsFolder: 'e2e/screenshots',
  videosFolder: 'e2e/videos',
  chromeWebSecurity: true,
  viewportWidth: 1366,
  viewportHeight: 768,
  env: {
    coverage: false,
    transactionWaitTime: 120000,
  },
  video: true,
  defaultCommandTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  pageLoadTimeout: process.env.SYNDEBUG ? 0 : 9999999,
  requestTimeout: process.env.SYNDEBUG ? 0 : 9999999,
  e2e: {
    setupNodeEvents(on, config) {
      // ❗ Leave this at the top to prevent conflicts with other plugins
      ;[on, config] = require('@deploysentinel/cypress-debugger/plugin')(on, config)
      require('cypress-localstorage-commands/plugin')(on, config)
      importedSetupNodeEvents(on, config)
      return config
    },
    projectId: '4zmgdz',
    baseUrl: 'http://localhost:8788',
    specPattern: 'e2e/specs/stateful/**/*.{js,jsx,ts,tsx}',
    supportFile: 'e2e/support.js',
    experimentalSessionAndOrigin: true,
  },
})

function getSynpressPath() {
  return '../node_modules/@synthetixio/synpress'
}
