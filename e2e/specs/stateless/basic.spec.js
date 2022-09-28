import { increaseTime, syncTime } from '../../clean'
import { acceptMetamaskAccess } from '../../setup'

describe('Register Name', () => {
  before(() => {
    acceptMetamaskAccess(3, true)
    cy.wrap(syncTime(60))
  })
  describe('not primary', () => {
    it('should redirect to the registration page on search', () => {
      // cy.visit('/')
      // cy.reload()
      // cy.clock()
      cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
      cy.findByText('Register registration-normal.eth').should('be.visible')
    })
    it('should show set profile button on info step', () => {
      cy.findByTestId('next-button').click()
      cy.findByTestId('next-button').click()
    })
    it('should allow registering a name without setting primary name', () => {
      cy.findByTestId('next-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction().then(() => increaseTime(60))
      cy.findByTestId('finish-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('view-name').click()
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
    })
  })
})
