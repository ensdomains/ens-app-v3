import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

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
      connectFromExisting()
      cy.visit('/my/settings')
    })
    it('should show the correct transaction details for a transaction modal', () => {
      cy.contains('Test Send Name').click()
      cy.findByTestId('display-item-action-normal').should('contain.text', 'Send Name')
      cy.findByTestId('display-item-info-normal').should(
        'contain.text',
        'Set the controller and registrant of the name',
      )
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.contains('Waiting for Wallet').should('be.visible')
      cy.findByTestId('transaction-modal-confirm-button').should('be.disabled')
      cy.confirmMetamaskTransaction()
      cy.contains('Your transaction is now complete!').should('be.visible')
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Send Name" transaction was successful')
      cy.findByTestId('close-icon').click()
    })
    it('should add a successful transaction to the transaction list, and show the corresponding notification', () => {
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.wait(500)
      cy.findAllByTestId('transaction-confirmed')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')

      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Test Transaction" transaction was successful')
      cy.findByTestId('close-icon').click()
    })
    it('should add a failed transaction to the transaction list, and show the corresponding notification', () => {
      cy.contains('Add Failing Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.wait(500)
      cy.findByTestId('transaction-failed')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Failure')
        .should('contain.text', 'Your "Test Transaction" transaction failed and was reverted')
      cy.findByTestId('close-icon').click()
    })

    it('should add a pending transaction to the transaction list, and show the corresponding notification once confirmed', () => {
      cy.contains('Stop Automine').click()
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.wait(500)
      cy.findByTestId('transaction-pending')
        .should('be.visible')
        .should('contain.text', 'Test Transaction')
      cy.contains('Start Automine').click()
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('contain.text', 'Transaction Successful')
        .should('contain.text', 'Your "Test Transaction" transaction was successful')
      cy.findByTestId('close-icon').click()
    })
  })
})
