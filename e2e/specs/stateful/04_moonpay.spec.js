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

describe.skip('Moonpay regsitration', () => {
  it.skip('should open up moonpay flow if selected', () => {
    cy.changeMetamaskNetwork('goerli')

    acceptMetamaskAccess()
    cy.visit(`/${makeid(230)}.eth/register`)
    cy.contains('Credit or debit card').click()
    cy.contains('Next').click()

    cy.get('#moonpayIframe')
      .invoke('attr', 'src')
      .then((src) => {
        cy.origin('https://buy-sandbox.moonpay.com', { args: { src } }, ({ src }) => {
          cy.visit(src)
          cy.get('[data-testid="submitButton"]').click()
          //Have to stop here because moonpay flow requires email confirmation
          //Also need to add this to synpress stateful config:     experimentalSessionAndOrigin: true,
        })
      })
  })
})
