import { acceptMetamaskAccess } from '../../setup'

const newResolver = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49'
const oldResolver = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'

describe('Update Resolver', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  describe('Happy', () => {
    describe('When profile is updated to latest resolver', () => {
      it('should disable the latest resolver button, have custom resolver checked, and allow user to change reslover address', () => {
        cy.visit('/profile/wrapped.eth')
        cy.findByTestId('more-tab').click()
        cy.findByTestId('edit-resolver-button').click()
        cy.findByTestId('latest-resolver-radio').should('be.disabled')
        cy.findByTestId('custom-resolver-radio').should('not.be.disabled')
        cy.findByTestId('dogfood').type(oldResolver)
        cy.findByTestId('update-button').click()
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.findByTestId('resolver-address').should('have.text', oldResolver)
      })
    })

    describe('When profile is not updated to latest resolver', () => {
      it('should allow user to update if they have chosen to use the latest resolver', () => {
        cy.findByTestId('accordion-resolverDetails-edit').click()
        cy.findByTestId('update-button').click()
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()

        //This is only needed on cypress, not sure why!
        cy.findByTestId('accordion-resolverDetails-edit').click()
        cy.findByTestId('update-button').click()
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()

        cy.findByTestId('resolver-address').should('have.text', newResolver)
      })
    })
  })

  describe('Unhappy', () => {
    it('should not allow user to update if they enter an invalid address', () => {
      cy.findByTestId('accordion-resolverDetails-edit').click()
      cy.findByTestId('custom-resolver-radio').click()
      cy.findByTestId('dogfood').type('0xInvalid')
      cy.findByTestId('update-button').should('be.disabled')
    })
  })
})
