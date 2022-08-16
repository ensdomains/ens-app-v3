export const acceptMetamaskAccess = (account = 1) => {
  cy.visit('/')
  cy.window().then((win) => win.ethereum.selectedAddress && cy.disconnectMetamaskWalletFromDapp())
  cy.switchMetamaskAccount(account)
  cy.resetMetamaskAccount()
  cy.contains('Connect Wallet').click()
  cy.contains('MetaMask').click()
  cy.wait(1000)
  cy.window()
    .then((win) => (!win.ethereum ? [] : win.ethereum.request({ method: 'eth_accounts' })))
    .then((accounts) => {
      if (!accounts.length) {
        cy.acceptMetamaskAccess()
      }
    })
}

export const connectFromExisting = () => {
  cy.get('body', {
    timeout: 250,
  }).then(($body) => {
    const button = $body.find('[data-testid="connect-button"]')
    if (button.length) {
      cy.wrap(button).click()
      cy.contains('MetaMask').click()
    }
  })
}
