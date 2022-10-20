import { acceptMetamaskAccess } from '../../setup'

describe('Address', () => {
  it('should allow user to connect', () => {
    // acceptMetamaskAccess()
    cy.visit('/')
    // replace with data-testid when design system supports it
    cy.contains('0x', {
      timeout: 15000,
    }).click()
    cy.contains('Profile').should('be.visible')
    cy.contains('0x').click()
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
      .type('0x538E35B2888eD5bc58Cf2825D76cf6265aA4e31e')
      .wait(1000)
      .type('{enter}')
    cy.findByTestId('no-profile-snippet').should('be.visible')
    cy.contains('No primary name set').should('be.visible')
  })
})
