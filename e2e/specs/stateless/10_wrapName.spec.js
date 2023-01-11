import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Wrap Name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should allow wrapping a subdomain', () => {
    cy.visit('/profile/sub.unwrapped-with-wrapped-subnames.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('be.visible')
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade')

    // should approve name wrapper for address
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-modal-inner').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for name wrapper approval')
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should wrap the name
    // arbitrary wait so metamask updates the account nonce
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for wrapping name')
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should remove the notification once the name is wrapped
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
})
