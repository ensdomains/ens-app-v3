import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Extend Names', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  it('should be able to register multiple names on the address page', () => {
    cy.clearLocalStorage()
    const NAMES = ['other-registrant.eth']
    acceptMetamaskAccess(2)
    cy.visit('/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

    cy.log('get the base data to compare')
    NAMES.forEach((name) => {
      cy.findByTestId(`name-item-${name}`)
        .findByTestId('short-expiry')
        .invoke('attr', 'data-timestamp')
        .then((timestamp) => {
          cy.log(`name: ${name} timestamp: ${timestamp}`)
          cy.wrap(timestamp).as(name)
        })
    })

    cy.log('select the names')
    cy.findByTestId('check-button').click()
    NAMES.forEach((name) => {
      cy.findByTestId(`name-item-${name}`).click()
    })

    cy.log('show the extend modal')
    cy.findByTestId('extend-names-button').click()

    cy.log('check the invoice details')
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032')
    cy.findByTestId('invoice-item-1-amount').should('contain.text', '0.0001')
    cy.findByTestId('invoice-total').should('contain.text', '0.0033')
    cy.findByText('1 year extension').should('be.visible')

    cy.log('check the price comparison table')
    cy.findByTestId('year-marker-0').should('include.text', '4% gas')
    cy.findByTestId('year-marker-1').should('include.text', '2% gas')
    cy.findByTestId('year-marker-2').should('include.text', '1% gas')

    cy.log('increment and save')
    cy.findByTestId('plus-minus-control-plus').click()
    cy.findByTestId('extend-names-confirm').click()
    cy.contains('Extending this name will not give you ownership of it').should('exist')
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(5000)

    NAMES.forEach((name) => {
      cy.get(`@${name}`).then((timestamp) => {
        const newTimestamp = parseInt(timestamp) + 31536000000 * 2
        cy.findByTestId(`name-item-${name}`)
          .findByTestId('short-expiry')
          .invoke('attr', 'data-timestamp')
          .should('eq', newTimestamp.toString())
      })
    })
  })

  it('should extend a single name', () => {
    cy.clearLocalStorage()
    cy.visit('/other-registrant.eth')
    connectFromExisting()
    cy.findByTestId('extend-button').should('be.visible')
    cy.findByTestId('owner-profile-button-expiry').should('be.visible')
    cy.findByTestId('owner-profile-button-expiry')
      .invoke('attr', 'data-timestamp')
      .then((timestamp) => {
        cy.log(`timestamp: ${timestamp}`)
        cy.wrap(timestamp).as('timestamp')
      })

    cy.log('should show the extend modal')
    cy.wait(1000)
    cy.findByTestId('extend-button').click()
    cy.findByTestId('extend-names-modal', { timeout: 10000 }).should('be.visible')
    cy.findByTestId('extend-names-names-list').should('not.exist')

    cy.log('should show the correct price data')
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032')
    cy.findByTestId('invoice-item-1-amount').should('contain.text', '0.0001')
    cy.findByTestId('invoice-total').should('contain.text', '0.0033')
    cy.findByText('1 year extension').should('be.visible')

    cy.log('should show the cost comparison data')
    cy.findByTestId('year-marker-0').should('include.text', '4% gas')
    cy.findByTestId('year-marker-1').should('include.text', '2% gas')
    cy.findByTestId('year-marker-2').should('include.text', '1% gas')

    cy.log('should not be able to set duration below 1')
    cy.findByTestId('plus-minus-control-minus').should('be.disabled')
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0032')

    cy.log('should show the correct price for yearly registration')
    cy.findByTestId('plus-minus-control-plus').click()
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0064')
    cy.findByText('2 year extension').should('be.visible')

    cy.log('should show the correct fiat values')
    cy.findByTestId('extend-names-currency-toggle').click({force: true})
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '$10.00')
    cy.findByTestId('invoice-item-1-amount').should('contain.text', '$0.19')
    cy.findByTestId('invoice-total').should('contain.text', '$10.19')
    cy.findByTestId('plus-minus-control-minus').click()
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '$5.00')
    cy.findByTestId('invoice-item-1-amount').should('contain.text', '$0.19')
    cy.findByTestId('invoice-total').should('contain.text', '$5.19')

    cy.log('should save')
    cy.findByTestId('extend-names-confirm').click()
    cy.contains('Extending this name will not give you ownership of it').should('be.exist')
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(5000)
    cy.get('@timestamp').then((timestamp) => {
      const newTimestamp = parseInt(timestamp) + 31536000000
      cy.findByTestId('owner-profile-button-expiry')
        .invoke('attr', 'data-timestamp')
        .should('eq', newTimestamp.toString())
    })
  })

  it('should extend a single name in grace period', () => {
    cy.clearLocalStorage()
    cy.visit('/grace-period.eth')
    connectFromExisting()

    cy.findByTestId('extend-button').as('extend-button')

    cy.get('@extend-button').should('be.visible')
    cy.findByTestId('owner-profile-button-expiry').should('be.visible')
    cy.findByTestId('owner-profile-button-expiry')
      .invoke('attr', 'data-timestamp')
      .then((timestamp) => {
        cy.log(`timestamp: ${timestamp}`)
        cy.wrap(timestamp).as('timestamp')
      })

    cy.findByTestId('extend-button').click()
    cy.findByTestId('extend-names-modal', { timeout: 10000 }).should('be.visible')

    cy.findByTestId('extend-names-confirm').click()

    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(5000)
    cy.get('@timestamp').then((timestamp) => {
      const newTimestamp = parseInt(timestamp) + 31536000000
      cy.findByTestId('owner-profile-button-expiry')
        .invoke('attr', 'data-timestamp')
        .should('eq', newTimestamp.toString())
    })
  })

  it('should be able to extend multiple names on the names page', () => {
    const NAMES = [
      'test123.eth',
      'with-subnames.eth',
      'to-be-wrapped.eth',
      'grace-period-in-list.eth',
    ]

    acceptMetamaskAccess(2)
    cy.visit('/my/names')

    cy.findByTestId('select-page-size').click()
    cy.wait(1000)
    cy.findByTestId('select-option-100').click()

    cy.log('get the base data to compare')
    NAMES.forEach((name) => {
      cy.findByTestId(`name-item-${name}`)
        .findByTestId('short-expiry')
        .invoke('attr', 'data-timestamp')
        .then((timestamp) => {
          cy.log(`name: ${name} timestamp: ${timestamp}`)
          cy.wrap(timestamp).as(name)
        })
    })

    cy.log('select the names')
    cy.findByTestId('check-button').click()
    NAMES.forEach((name) => {
      cy.findByTestId(`name-item-${name}`).click()
    })

    cy.log('show the extend modal')
    cy.findByTestId('extend-names-button').click()
    cy.findByTestId('extend-names-names-list').should('be.visible')
    cy.get('button').contains('Next').click()

    cy.log('check the invoice details')
    cy.findByTestId('invoice-item-0-amount').should('contain.text', '0.0128')
    cy.findByTestId('invoice-item-1-amount').should('contain.text', '0.0004')
    cy.findByTestId('invoice-total').should('contain.text', '0.0132')
    cy.findByText('1 year extension').should('be.visible')

    cy.log('check the price comparison table')
    cy.findByTestId('year-marker-0').should('include.text', '3% gas')
    cy.findByTestId('year-marker-1').should('include.text', '2% gas')
    cy.findByTestId('year-marker-2').should('include.text', '1% gas')

    cy.log('increment and save')
    cy.findByTestId('plus-minus-control-plus').click()
    cy.findByTestId('extend-names-confirm').click()
    cy.contains('Extending this name will not give you ownership of it').should('not.exist')
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.wait(5000)
    NAMES.forEach((name) => {
      cy.get(`@${name}`).then((timestamp) => {
        const newTimestamp = parseInt(timestamp) + 31536000000 * 2
        cy.findByTestId(`name-item-${name}`)
          .findByTestId('short-expiry')
          .invoke('attr', 'data-timestamp')
          .should('eq', newTimestamp.toString())
      })
    })
  })

  it('should not show extend button on subnames', () => {
    cy.visit('/test.with-subnames.eth')
    connectFromExisting()
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('extend-subname-action', { timeout: 2000 }).should('not.exist')
  })
})
