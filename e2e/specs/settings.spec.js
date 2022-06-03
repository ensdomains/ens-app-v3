describe('Settings', () => {
  it('should allow user to disconnect', () => {
    cy.visit('/')
    cy.contains('Connect').click()
    cy.contains('MetaMask').click()
    cy.acceptMetamaskAccess()

    cy.visit('/my/settings')
    cy.contains('Disconnect').click()
    cy.url().should('eq', 'http://localhost:3000/')
  })

  describe('Transactions', () => {
    it('should add successful transaction to the transaction list, and show the corresponding notification', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.visit('/my/settings')
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.contains('Test Transaction')
        .parent()
        .should('be.visible')
        .should('have.text', 'Confirmed')
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('have.text', 'Transaction Successful')
        .should(
          'have.text',
          'Your "Test Transaction" transaction was successful',
        )
    })

    it('should add a failed transaction to the transaction list, and show the corresponding notification', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.visit('/my/settings')
      cy.contains('Add Failing Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.contains('Test Transaction')
        .parent()
        .should('be.visible')
        .should('have.text', 'Failed')
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('have.text', 'Transaction Failure')
        .should(
          'have.text',
          'Your "Test Transaction" transaction failed and was reverted',
        )
    })

    it('should add a pending transaction to the transaction list, and show the corresponding notification once confirmed', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.visit('/my/settings')
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.contains('Test Transaction')
        .parent()
        .should('be.visible')
        .should('have.text', 'Pending')
      cy.findByTestId('toast-desktop')
        .should('be.visible')
        .should('have.text', 'Transaction Successful')
        .should(
          'have.text',
          'Your "Test Transaction" transaction was successful',
        )
    })

    it('should clear transactions when clear is pressed', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.visit('/my/settings')
      cy.contains('Add Successful Transaction').click()
      cy.confirmMetamaskTransaction()
      cy.contains('Clear').click()
      cy.contains('Test Transaction').should('be.undefined')
    })
  })
})
