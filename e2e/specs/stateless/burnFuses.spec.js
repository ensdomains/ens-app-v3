import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Burn Fuses', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should allow owner to burn fuses', () => {
    cy.visit('/profile/wrapped.eth')
    cy.findByText('View Details').click()
    cy.findByText('Advanced').click()
    cy.findByTestId('accordion-fuses-edit').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('burn-button-CANNOT_BURN_FUSES').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('burn-button-CANNOT_UNWRAP').click()
    cy.findByText('Burn Selected').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })
})
