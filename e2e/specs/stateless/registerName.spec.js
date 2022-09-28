import { increaseTime, syncTime } from '../../clean'
import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Register Name', () => {
  before(() => {
    acceptMetamaskAccess(3, true)
  })
  describe('normal registration', () => {
    before(() => {
      cy.wrap(syncTime(60))
    })
    it('should redirect to the registration page on search', () => {
      cy.visit('/')
      cy.wrap(syncTime)
      cy.reload()
      cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
      cy.findByText('Register registration-normal.eth').should('be.visible')
    })
    it('should show primary name setting as checked', () => {
      cy.findByTestId('checkbox').should('be.checked')
    })
    it('should show adjusted gas estimate when primary name setting checked', () => {
      cy.findByTestId('invoice-item-1-amount')
        .should('be.visible')
        .then(($item) => {
          const estimate = parseFloat($item.text())
          cy.wrap(estimate).as('estimate')
          expect(estimate).to.be.greaterThan(0)
          cy.findByTestId('checkbox')
            .click()
            .then(function () {
              expect(parseFloat($item.text())).to.be.lessThan(this.estimate)
            })
            .then(() => {
              cy.findByTestId('checkbox').click()
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
      cy.findByTestId('next-button').should('contain.text', 'Begin').click()
      cy.findByText('Confirm Details').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction().then(() => increaseTime(60))
    })
    it('should show countdown', () => {
      cy.findByTestId('countdown-circle').should('be.visible')
      cy.findByTestId('finish-button').should('exist').should('be.enabled')
    })

    // NOTE: this doesn't work at the moment because cypress doesn't save local storage on reload
    // it('should save the registration state, and the transaction status', () => {
    //   cy.reload()
    //   connectFromExisting()
    //   cy.findByTestId('finish-button').should('exist').should('be.enabled')
    // })

    it('should allow finalising registration and automatically go to the complete step', () => {
      cy.findByTestId('finish-button').click()
      cy.findByText('Confirm Details').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
    })
    it('should show the correct details on completion', () => {
      cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032 ETH')
    })
    it('should not direct to the registration page on search', () => {
      cy.findByTestId('home-button').click()
      cy.findByTestId('search-input-box').click().type('registration-normal.eth{enter}')
      cy.url().should('eq', 'http://localhost:3000/profile/registration-normal.eth')
    })
    it('should show all records from registration', async () => {
      cy.findByTestId('profile-snippet-name').should('contain.text', 'Test Name')
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x3C4...293BC')
    })
  })
  describe('not primary', () => {
    before(() => {
      cy.wrap(syncTime(60))
    })
    it('should show primary name setting as unchecked if primary already set', () => {
      cy.visit('/register/registration-not-primary.eth')
      connectFromExisting()
      cy.findByTestId('checkbox').should('not.be.checked')
    })
    it('should show set profile button on info step', () => {
      cy.findByTestId('next-button').click()
      cy.findByTestId('setup-profile-button').should('be.visible')
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
  describe('premium', () => {
    before(() => {
      cy.wrap(syncTime(60))
    })
    it('should allow registration', () => {
      cy.visit('/register/name-with-premium.eth')
      connectFromExisting()
      cy.findByTestId('invoice-item-2-amount').should('be.visible')
      cy.findByTestId('next-button').click()
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
  // it('should not show add subname button when the connected wallet is the registrant but not the controller', () => {
  //   cy.visit('/profile/other-controller.eth/details')
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByTestId('add-subname-action', { timeout: 2000 }).should('not.exist')
  // })
  // it('should not show add subname button when the connected wallet does not own the name', () => {
  //   cy.visit('/profile/other-registrant.eth/details')
  //   connectFromExisting()
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByTestId('add-subname-action', { timeout: 2000 }).should('not.exist')
  // })
  // it('should show add subname button when the connected wallet owns the name', () => {
  //   cy.visit('/profile/test123.eth/details')
  //   connectFromExisting()
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByTestId('add-subname-action').click()
  // })
  // it('should not allow creating a subname with invalid characters', () => {
  //   cy.findByTestId('add-subname-input').type('test ')
  //   cy.findByTestId('create-subname-next').should('be.disabled')
  //   cy.findByText('Contains invalid characters').should('be.visible')
  // })
  // it('should allow creating a subname', () => {
  //   cy.findByTestId('add-subname-input').clear().type('test')
  //   cy.findByTestId('create-subname-next').click()
  //   cy.findByTestId('transaction-modal-confirm-button').click()
  //   cy.confirmMetamaskTransaction()
  //   cy.findByTestId('transaction-modal-complete-button').click()
  //   cy.reload()
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByText('test.test123.eth').should('be.visible')
  // })
  // it('should allow creating a subnames if the user is the wrapped owner', () => {
  //   cy.visit('/profile/wrapped.eth/details')
  //   connectFromExisting()
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByTestId('add-subname-action').click()
  //   cy.findByTestId('add-subname-input').clear().type('test')
  //   cy.findByTestId('create-subname-next').click()
  //   cy.findByTestId('transaction-modal-confirm-button').click()
  //   cy.confirmMetamaskTransaction()
  //   cy.findByTestId('transaction-modal-complete-button').click()
  //   cy.reload()
  //   cy.findByTestId('subnames-tab').click()
  //   cy.findByText('test.wrapped.eth').should('be.visible')
  // })
  // it('should not allow adding a subname that already exists', () => {
  //   cy.findByTestId('add-subname-action').click()
  //   cy.findByTestId('add-subname-input').clear().type('test')
  //   cy.findByTestId('create-subname-next').should('be.disabled')
  // })
})
