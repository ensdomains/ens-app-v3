import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Import DNSSEC name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should not proceed if DNSSEC is not enabled on that domain', () => {
    cy.visit('/profile/notdnssec.com')
    cy.findByText('Check').click()
    cy.findByText('DNSSEC has not been enabled on this domain.').should('be.visible')
  })
  it('should not allow the use to proceed if they have not set the correct subdomain', () => {
    cy.visit('/profile/noenssubdomain.com')
    connectFromExisting()
    cy.findByText('Check').click()
    cy.findByText('Subdomain not set').should('be.visible')
  })
  it('should not allow the use to proceed if they have not set the correct subdomain with the correct info', () => {
    cy.visit('/profile/invalidensrecord.com')
    connectFromExisting()
    cy.findByText('Check').click()
    cy.findByText('Record Invalid').should('be.visible')
  })
  it('should allow user to import a domain that they are not the owner of', () => {
    cy.visit('/profile/leontalbert.xyz')
    connectFromExisting()
    cy.findByText('0x70997970C51812dc3A010C7d01b50e0d17dc79C8').should('be.visible')
    cy.findByText('Check').click()
    cy.findByText(
      "You don't appear to be the DNS Owner of this domain, but you can still add this name to ENS Registry.",
    ).should('be.visible')
    cy.findByText('Continue').click()
    cy.findByText('You are importing a DNS name that you appear to not own.').should('be.visible')
    cy.findByText('Claim').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByText('Congratulations!').should('be.visible')
  })
  it('should allow user to import a name that they are the owner of', () => {
    cy.visit('/profile/leontalbert.com')
    connectFromExisting()
    cy.findByText('0x70997970C51812dc3A010C7d01b50e0d17dc79C8').should('be.visible')
    cy.findByText('Check').click()
    cy.findByText('You have verified your ownership and can claim this domain.').should(
      'be.visible',
    )
    cy.findByText('Claim').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByText('Congratulations!').should('be.visible')
  })
  it('should not show the success message again once seen', () => {
    cy.findByText('View Name').click()
    cy.reload()
    cy.findByText('DNS Owner').should('be.visible')
  })
})
