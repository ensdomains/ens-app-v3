import { acceptMetamaskAccess } from '../../setup'

describe('Burn Fuses', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should not allow owner to burn PCC', () => {
    cy.visit('/profile/wrapped.eth')
    cy.findByTestId('more-tab').click()
    cy.findByTestId('edit-fuses-button').click()
    cy.findByTestId('burn-button-PARENT_CANNOT_CONTROL', { timeout: 2000 }).should('not.exist')
  })
  it('should allow owner to burn fuses only after CANNOT_UNWRAP has been selected', () => {
    cy.findByText('Burn Selected').click()
    cy.findByTestId('burn-button-CANNOT_TRANSFER').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('burn-button-CANNOT_UNWRAP').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })
  it('should not allow owner to burn already burned fuses', () => {
    cy.findByTestId('edit-fuses-button').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('transaction-modal-confirm-button', { timeout: 2000 }).should('not.exist')
  })
})
