import { acceptMetamaskAccess } from '../setup'

describe('Address', () => {
  it('should show profile', () => {
    cy.visit('/address/0x866b3c4994e1416b7c738b9818b31dc246b95eee')
    cy.get('[data-testid="profile-snippet"]').should('be.visible')
  })

  it('should not show profile', () => {
    cy.visit('/address/0x538E35B2888eD5bc58Cf2825D76cf6265aA4e31e')
    cy.get('[data-testid="no-profile-snippet"]').should('be.visible')
    cy.contains('Could not find address').should('be.visible')
  })
})