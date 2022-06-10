export const acceptMetamaskAccess = () => {
  cy.visit('/')
  cy.contains('Connect').click()
  cy.contains('MetaMask').click()
  cy.wait(1000)
  cy.window()
    .then((win) =>
      !win.ethereum ? [] : win.ethereum.request({ method: 'eth_accounts' }),
    )
    .then((accounts) => {
      if (!accounts.length) {
        cy.acceptMetamaskAccess()
      }
    })
}
