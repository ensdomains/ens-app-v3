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

  it('should ask user whose name has not been upated to latest resolver to if the want to transfer profile', () => {
    cy.visit('/profile/to-be-wrapped.eth')
    cy.contains('Edit Profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').click()
  })

  it('should be able to save and migrate profile', () => {
    cy.findByPlaceholderText('John Smith').type('Test Name')
    cy.findByText('Save').should('not.be.disabled').click()
    cy.findByText('Start').should('not.be.disabled').click()
  })
})