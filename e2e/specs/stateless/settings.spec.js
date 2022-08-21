import { acceptMetamaskAccess } from '../../setup'

describe('Settings', () => {
  it('should allow user to disconnect', () => {
    acceptMetamaskAccess(undefined, true)
    cy.visit('/my/settings')
    cy.findByTestId('wallet-section-disconnect').click()
    cy.url().should('eq', 'http://localhost:3000/')
  })

  describe('Transactions', () => {
    before(() => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()
      cy.wait(1000)
      cy.visit('/my/settings')
    })
    it('should show the correct transaction details for a transaction modal', () => {
      cy.contains('Test Send Name').click()
      cy.findByTestId('display-item-action-normal').should('contain.text', 'Send Name')
      cy.findByTestId('display-item-info-normal').should(
        'contain.text',
        'Set the controller and registrant of the name',
      )
      cy.findByTestId('transaction-modal-request-trailing-btn').click()
      cy.contains('Awaiting wallet confirmation').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-trailing-btn').should('be.disabled')
      cy.confirmMetamaskTransaction()
      cy.contains('Your transaction has been saved to the blockchain!').should('be.visible')
      cy.findByTestId('transaction-modal-complete-trailing-btn').click()
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Send Name" transaction was successful')
    })
    it('should add a successful transaction to the transaction list, and show the corresponding notification', () => {
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-confirmed')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')

      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Test Transaction" transaction was successful')
    })

    it('should add a failed transaction to the transaction list, and show the corresponding notification', () => {
      cy.contains('Add Failing Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-failed')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Failure')
        .should('contain.text', 'Your "Test Transaction" transaction failed and was reverted')
    })

    it('should add a pending transaction to the transaction list, and show the corresponding notification once confirmed', () => {
      cy.contains('Stop Automine').click()
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-pending')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')
      cy.contains('Start Automine').click()
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Test Transaction" transaction was successful')
    })

    it('should clear transactions when clear is pressed', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()
      cy.wait(1000)

      cy.visit('/my/settings')
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.contains('Clear').click()
      cy.findByTestId('transaction-confirmed').should('not.exist')
    })
  })
})
