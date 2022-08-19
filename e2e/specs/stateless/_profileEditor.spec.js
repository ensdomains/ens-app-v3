import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Profile Editor', () => {
  before(() => {
    acceptMetamaskAccess(2)
  })

  it('should force a name on the old registry to ', () => {
    cy.visit('/profile/legacy.test')
    connectFromExisting()
    cy.contains('Edit Profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').should('not.exist')
    cy.contains('Your registry is out of date').should('be.visible')
  })

  it('should force a user without a resolver set to migrate resolver', () => {
    cy.visit('/profile/reverse')
    connectFromExisting()
    cy.contains('Edit Profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').should('not.exist')
    cy.contains('No resolver assigned').should('be.visible')
  })

  it('should be able to update resolver if profile has been migrated but resolver has not been updated', () => {
    cy.visit('/profile/migrated-resolver-to-be-updated.eth')
    connectFromExisting()
    cy.contains('Edit Profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').should('be.visible')
    cy.contains('Update').click()
    cy.findByTestId('transaction-modal-request-trailing-btn').should('not.be.disabled').click()
    cy.confirmMetamaskTransaction()
    cy.contains('Close').click()
    cy.reload()
    cy.contains('0x3C4...293BC').should('be.visible')
  })

  it('should be able to migrate account to new resolver', () => {
    cy.visit('/profile/test123.eth')
    connectFromExisting()
    cy.contains('Edit Profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').should('be.visible')
    cy.contains('Update').click()
    cy.findByTestId('transfer-profile-trailing-btn').should('not.be.disabled').click()
    cy.findByTestId('transaction-modal-request-trailing-btn').should('not.be.disabled').click()
    cy.confirmMetamaskTransaction()
    cy.contains('Continue').should('not.be.disabled').click()
    cy.findByTestId('transaction-modal-request-trailing-btn').should('not.be.disabled').click()
    cy.confirmMetamaskTransaction()
    cy.get('button').contains('Close').click()
    cy.reload()
    cy.contains('0x709...c79C8').should('be.visible')
  })

  it('should be able to update account', () => {
    cy.visit('/profile/wrapped.eth')
    connectFromExisting()
    cy.contains('Edit Profile').click()
    cy.findByPlaceholderText('John Smith').type('Test Name')
    cy.findByText('Save').should('not.be.disabled').click()
    cy.findByTestId('transaction-modal-request-trailing-btn').should('not.be.disabled').click()
    cy.confirmMetamaskTransaction()
    cy.get('button').contains('Close').click()
    cy.reload()
    cy.contains('Test Name').should('be.visible')
  })
})