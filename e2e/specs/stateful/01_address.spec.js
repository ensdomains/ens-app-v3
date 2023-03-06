import { acceptMetamaskAccess } from '../../setup'

describe('Address', () => {
  it('should allow user to connect', () => {
    cy.changeMetamaskNetwork('goerli')
    acceptMetamaskAccess()
    cy.visit('/')
    cy.findByTestId('header-profile').click()
    cy.contains('Profile').should('be.visible')
    cy.findByTestId('header-profile').click()
    cy.contains('Profile').should('not.be.visible')
  })

  it('should go to the address page', () => {
    cy.get('[placeholder="Search for a name"]')
      .type('0x866b3c4994e1416b7c738b9818b31dc246b95eee')
      .wait(1000)
      .type('{enter}')
  })

  it('should show the profile if there is a primary name for the address', () => {
    cy.findByTestId('profile-snippet').should('be.visible')
  })

  it('should not show the profile if there is no primary name for the address', () => {
    cy.get('[placeholder="Search for a name"]')
      .type('0x2330eb2d92167c3b6b22690c03b508e0ca532980')
      .wait(1000)
      .type('{enter}')
    cy.findByTestId('no-profile-snippet').should('be.visible')
    cy.contains('No primary name set').should('be.visible')
  })
})
