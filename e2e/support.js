import '@deploysentinel/cypress-debugger/support'
import '@synthetixio/synpress/support/index'
import 'cypress-localstorage-commands'

beforeEach(() => {
  cy.restoreLocalStorage()
  console.log('beforeEach txFlow', localStorage.getItem( 'tx-flow'))
})

afterEach(() => {
  cy.saveLocalStorage()
  console.log('beforeEach txFlow', localStorage.getItem( 'tx-flow'))
})
