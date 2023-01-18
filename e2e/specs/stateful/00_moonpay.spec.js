import { acceptMetamaskAccess } from '../../setup'

function makeid(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

describe('Address', () => {
  it('should allow user to connect', () => {
    acceptMetamaskAccess()
    cy.visit(`/${makeid(250)}.eth/register`)
    cy.contains('Next').click()
    cy.contains('Credit or debit card').click()
    cy.contains('Begin').click()
    // replace with data-testid when design system supports it
    // cy.contains('Profile').should('be.visible')
    // cy.contains('0x').click()
    // cy.contains('Profile').should('not.be.visible')
  })

  //   it('should go to the address page', () => {
  //     cy.get('[placeholder="Search for a name"]')
  //       .type('0x866b3c4994e1416b7c738b9818b31dc246b95eee')
  //       .wait(1000)
  //       .type('{enter}')
  //   })

  //   it('should show the profile if there is a primary name for the address', () => {
  //     cy.findByTestId('profile-snippet').should('be.visible')
  //   })

  //   it('should not show the profile if there is no primary name for the address', () => {
  //     cy.get('[placeholder="Search for a name"]')
  //       .type('0x2330eb2d92167c3b6b22690c03b508e0ca532980')
  //       .wait(1000)
  //       .type('{enter}')
  //     cy.findByTestId('no-profile-snippet').should('be.visible')
  //     cy.contains('No primary name set').should('be.visible')
  //   })
})
