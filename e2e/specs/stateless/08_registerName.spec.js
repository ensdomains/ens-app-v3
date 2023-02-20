import { increaseTime, syncTime } from '../../clean'
import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Register Name', () => {
  before(() => {
    cy.wrap(acceptMetamaskAccess(3, true)).then(() => syncTime(180))
  })
  it('should allow normal registration', function () {
    cy.visit('/')
    // should redirect to the registration page on search
    cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
    cy.findByText('Register registration-normal.eth').should('be.visible')

    // should show primary name setting as checked
    cy.findByTestId('payment-choice-ethereum').click()
    cy.findByTestId('primary-name-toggle').should('be.checked')

    // should show adjusted gas estimate when primary name setting checked
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

    // should show cost comparison accurately
    cy.findByTestId('year-marker-0').should('include.text', '18% gas')
    cy.findByTestId('year-marker-1').should('include.text', '10% gas')
    cy.findByTestId('year-marker-2').should('include.text', '4% gas')

    // should show correct price for yearly registration
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032')
    cy.findByTestId('plus-minus-control-plus').click()
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0064')
    cy.findByTestId('plus-minus-control-minus').click()

    // should go to profile editor step
    cy.findByTestId('next-button').click()

    // should show a confirmation dialog that records are public
    cy.findByTestId('show-add-profile-records-modal-button').click()
    cy.findByTestId('confirmation-dialog-confirm-button').click()

    // should all setting a gener text record
    cy.findByTestId('profile-record-option-name').click()
    cy.findByTestId('add-profile-records-button').click()
    cy.findByTestId('profile-record-input-input-name').type('Test Name')

    // should show ETH record by default
    cy.findByDisplayValue('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC').should('be.visible')

    // should show go to info step and show updated estimate
    cy.findByTestId('profile-submit-button').should('contain.text', 'Next').click()
    cy.findByTestId('invoice-item-1-amount').should('not.contain.text', `${this.estimate} ETH`)

    // should go to transactions step and open commit transaction immediately
    cy.wait(1000)
    cy.findByTestId('next-button').should('contain.text', 'Begin').click()
    cy.findByText('Open Wallet').should('be.visible')
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()

    // should show countdown
    cy.findByTestId('countdown-circle').should('be.visible')
    cy.findByTestId('countdown-complete-check')
      .should('be.visible')
      .then(() => increaseTime(60))
    cy.findByTestId('finish-button').should('exist').should('be.enabled')

    // should save the registration state and the transaction status
    cy.reload()
    cy.findByTestId('finish-button').should('exist').should('be.enabled')

    // should allow finalising registration and automatically go to the complete step
    cy.wait(1000)
    cy.findByTestId('finish-button').click()
    cy.findByText('Open Wallet').should('be.visible')
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.wait(10000)

    // should show the correct details on completion
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032 ETH')
  })
  it('should not direct to the registration page on search, and show all records from registration', () => {
    cy.findByTestId('home-button').click()
    cy.wait(1000)
    cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
    cy.url().should('eq', 'http://localhost:8788/registration-normal.eth')

    cy.findByTestId('profile-snippet-nickname').should('contain.text', 'Test Name')
    cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
  })
  it('should allow registering a non-primary name', () => {
    // should show primary name setting as unchecked if primary already set
    cy.visit('/registration-not-primary.eth/register')
    cy.findByTestId('payment-choice-ethereum').click()
    cy.findByTestId('primary-name-toggle').should('not.be.checked')

    // should show set profile button on info step
    cy.findByTestId('next-button').click()
    cy.findByTestId('setup-profile-button').should('be.visible')

    // should allow registering a name without setting primary name
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
    cy.wait(10000)
    cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
  })
  it('should allow registering a premium name', () => {
    cy.visit('/name-with-premium.eth/register')
    cy.findByTestId('payment-choice-ethereum').click()
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
