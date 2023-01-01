import { increaseTime, syncTime } from '../../clean'
import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Register Name', () => {
  before(() => {
    cy.wrap(acceptMetamaskAccess(3, true)).then(() => syncTime(180))
  })
  describe('normal registration', () => {
    it('should redirect to the registration page on search', () => {
      cy.visit('/')
      cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
      cy.findByText('Register registration-normal.eth').should('be.visible')
    })
    it('should show primary name setting as checked', () => {
      cy.findByTestId('primary-name-toggle').should('be.checked')
    })
    it('should show adjusted gas estimate when primary name setting checked', () => {
      cy.findByTestId('invoice-item-1-amount')
        .should('be.visible')
        .then(($item) => {
          const estimate = parseFloat($item.text())
          cy.wrap(estimate).as('estimate')
          expect(estimate).to.be.greaterThan(0)
          cy.findByTestId('primary-name-toggle')
            .click()
            .then(function () {
              expect(parseFloat($item.text())).to.be.lessThan(this.estimate)
            })
            .then(() => {
              cy.findByTestId('primary-name-toggle').click()
            })
        })
    })
    it('should show cost comparison accurately', () => {
      cy.findByTestId('year-marker-0').should('include.text', '18% gas')
      cy.findByTestId('year-marker-1').should('include.text', '10% gas')
      cy.findByTestId('year-marker-2').should('include.text', '4% gas')
    })
    it('should show the correct price for yearly registration', () => {
      cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032')
      cy.findByTestId('plus-minus-control-plus').click()
      cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0064')
      cy.findByTestId('plus-minus-control-minus').click()
    })
    it('should go to profile editor step', () => {
      cy.findByTestId('next-button').click()
      cy.findByText('General').should('be.visible')
    })
    it('should allow setting a general text record', () => {
      cy.findByText('Nickname').click().type('Test Name')
    })
    it('should show ETH record by default', () => {
      cy.findByText('Address').click()
      cy.findByDisplayValue('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC').should('be.visible')
    })
    it('should show go to info step and show updated estimate', function () {
      cy.findByTestId('next-button').should('contain.text', 'Next').click()
      cy.findByTestId('invoice-item-1-amount').should('not.contain.text', `${this.estimate} ETH`)
    })
    it('should go to transactions step and open commit transaction immediately', () => {
      cy.wait(1000)
      cy.findByTestId('next-button').should('contain.text', 'Begin').click()
      cy.findByText('Open Wallet').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
    })
    it('should show countdown', () => {
      cy.findByTestId('countdown-circle').should('be.visible')
      cy.findByTestId('countdown-complete-check')
        .should('be.visible')
        .then(() => increaseTime(60))
      cy.findByTestId('finish-button').should('exist').should('be.enabled')
    })
    it('should save the registration state, and the transaction status', () => {
      cy.reload()
      cy.findByTestId('finish-button').should('exist').should('be.enabled')
    })
    it('should allow finalising registration and automatically go to the complete step', () => {
      cy.wait(1000)
      cy.findByTestId('finish-button').click()
      cy.findByText('Open Wallet').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
    })
    it('should show the correct details on completion', () => {
      cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032 ETH')
    })
    it('should not direct to the registration page on search', () => {
      cy.findByTestId('home-button').click()
      cy.wait(1000)
      cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
      cy.url().should('eq', 'http://localhost:3000/profile/registration-normal.eth')
    })
    it('should show all records from registration', () => {
      cy.findByTestId('profile-snippet-nickname').should('contain.text', 'Test Name')
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
    })
  })
  describe('not primary', () => {
    it('should show primary name setting as unchecked if primary already set', () => {
      cy.visit('/register/registration-not-primary.eth')
      cy.findByTestId('primary-name-toggle').should('not.be.checked')
    })
    it('should show set profile button on info step', () => {
      cy.findByTestId('next-button').click()
      cy.findByTestId('setup-profile-button').should('be.visible')
    })
    it('should allow registering a name without setting primary name', () => {
      cy.findByTestId('next-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('countdown-complete-check')
        .should('be.visible')
        .then(() => increaseTime(60))
      cy.findByTestId('finish-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('view-name').click()
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
    })
  })
  describe('premium', () => {
    it('should allow registration', () => {
      cy.visit('/register/name-with-premium.eth')
      connectFromExisting()
      cy.findByTestId('invoice-item-2-amount').should('be.visible')
      cy.findByTestId('next-button').click()
      cy.findByTestId('next-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.wait(500)
      cy.findByTestId('countdown-complete-check')
        .should('be.visible')
        .then(() => increaseTime(60))
      cy.findByTestId('finish-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('view-name').click()
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
    })
  })
})
