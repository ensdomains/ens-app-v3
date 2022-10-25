import { acceptMetamaskAccess } from '../../setup'

describe('Import DNSSEC name', () => {
  it('should not proceed if DNSSEC is not enabled on that domain', () => {
    cy.changeMetamaskNetwork('goerli')
    acceptMetamaskAccess()
    cy.visit('/profile/notdnssec.com')
    cy.findByText('Check').click()
    cy.findByText('DNSSEC has not been enabled on this domain.').should('be.visible')
  })
  it('should not allow the use to proceed if they have not set the correct subdomain', () => {
    cy.visit('/profile/noenssubdomain.com')
    cy.wait(2000)
    cy.findByTestId('dnssec-check-button').click({ force: true })
    cy.findByText('Subdomain not set').should('be.visible')
  })
  it('should not allow the use to proceed if they have not set the correct subdomain with the correct info', () => {
    cy.visit('/profile/invalidensrecord.com')
    cy.wait(2000)
    cy.findByTestId('dnssec-check-button').click({ force: true })
    cy.findByText('Record Invalid').should('be.visible')
  })
  it('should allow user to import a domain that they are not the owner of', () => {
    cy.visit('/import/leontalbert.xyz')
    cy.findByText('0x32518828A071a0e6E549F989D4aaB4Cd7401be8f').should('be.visible')
    cy.wait(2000)
    cy.findByTestId('dnssec-check-button').click({ force: true })
    cy.findByText(
      "You don't appear to be the DNS Owner of this domain, but you can still add this name to ENS Registry.",
    ).should('be.visible')
    cy.findByText('Continue').click()
    cy.findByText('You are importing a DNS name that you appear to not own.').should('be.visible')
    cy.findByText('Claim').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button', {
      timeout: Cypress.env('transactionWaitTime'),
    }).click()
    cy.findByText('Congratulations!').should('be.visible')
  })
  it('should allow user to import a name that they are the owner of', () => {
    cy.wait(2000)
    cy.visit('/import/leontalbert.com')
    cy.findByText('0x32518828A071a0e6E549F989D4aaB4Cd7401be8f').should('be.visible')
    cy.wait(2000)
    cy.findByTestId('dnssec-check-button').click()
    cy.findByText('You have verified your ownership and can claim this domain.').should(
      'be.visible',
    )
    cy.findByText('Claim').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button', {
      timeout: Cypress.env('transactionWaitTime'),
    }).click()
    cy.findByText('Congratulations!').should('be.visible')
    cy.findByText('View Name').click()
    cy.wait(5000)
  })
  it('should not show the success message again once acknowledged', () => {
    cy.visit('/profile/leontalbert.com')
    cy.reload()
    cy.findByText('Manager').should('be.visible')
  })
})
