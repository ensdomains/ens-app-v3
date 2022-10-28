const { defineConfig } = require('cypress')
const importedSetupNodeEvents = require(`${getSynpressPath()}/plugins/index`)
const fixturesFolder = `${getSynpressPath()}/fixtures`

module.exports = defineConfig({
  projectId: '4zmgdz',
  userAgent: 'synpress',
  retries: {
    runMode: process.env.CI ? 5 : 1,
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
  },
  video: false,
  defaultCommandTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  pageLoadTimeout: process.env.SYNDEBUG ? 0 : 9999999,
  requestTimeout: process.env.SYNDEBUG ? 0 : 9999999,
  numTestsKeptInMemory: 0,
  e2e: {
    setupNodeEvents(on, config) {
      // ❗ Leave this at the top to prevent conflicts with other plugins
      ;[on, config] = require('@deploysentinel/cypress-debugger/plugin')(on, config)
      require('cypress-localstorage-commands/plugin')(on, config)
      require('./plugin')(on, config)
      importedSetupNodeEvents(on, config)
      return config
    },
    projectId: '4zmgdz',
    baseUrl: 'http://localhost:3000',
    specPattern: 'e2e/specs/stateless/**/*.{js,jsx,ts,tsx}',
    supportFile: 'e2e/support.js',
  },
})

function getSynpressPath() {
  return '../node_modules/@synthetixio/synpress'
}
