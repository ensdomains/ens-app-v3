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

describe('Moonpay regsitration', () => {
  it('should open up moonpay flow if selected', () => {
    cy.changeMetamaskNetwork('goerli')

    acceptMetamaskAccess()
    cy.visit(`/${makeid(230)}.eth/register`)
    cy.contains('Next').click()
    cy.contains('Skip').click()
    cy.contains('Credit or debit card').click()
    cy.contains('Begin').click()

    cy.get('#moonpayIframe')
      .invoke('attr', 'src')
      .then((src) => {
        cy.origin('https://buy-sandbox.moonpay.com', { args: { src } }, ({ src }) => {
          cy.visit(src)
          cy.get('[data-testid="submitButton"]').click()
          //Have to stop here because moonpay flow requires email confirmation
        })
      })
  })
})
