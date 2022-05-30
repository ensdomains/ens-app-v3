describe('Profile', () => {
  before(() => {
    cy.intercept('http://localhost:8000/**')
  })
  it('should allow user to connect', () => {
    cy.visit('/')
    cy.contains('Connect').click()
    cy.contains('MetaMask').click()
    cy.acceptMetamaskAccess()

    // replace with data-testid when design system supports it
    cy.contains('0x', {
      timeout: 15000,
    }).click()
    cy.contains('My Profile').should('be.visible')
    cy.contains('0x').click()
    cy.contains('My Profile').should('not.be.visible')
  })

  describe('profile', () => {
    it('should go to the profile page', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.get('[placeholder="Search for a name"]').type('jefflau')
      cy.get('[data-testid="search-button"]', {
        timeout: 100000,
      }).click()
    })

    it('should show the address records', () => {
      cy.contains('Addresses').should('be.visible')
      cy.get('[data-testid="address-profile-button-eth"]', {
        timeout: 25000,
      }).should('has.text', '0x866...95eEE')
    })
    it('should show profile data', () => {
      cy.contains('Hello2').should('be.visible')
      cy.contains('twitter.com').should('be.visible')
    })
    it('should show the back button, and allow user to go back', () => {
      cy.findByTestId('back-button').click()
      cy.url().should('eq', 'http://localhost:3000/')
    })
  })
  describe('name details', () => {
    it('should go to the profile page', () => {
      cy.visit('/')
      cy.contains('Connect').click()
      cy.contains('MetaMask').click()

      cy.get('[placeholder="Search for a name"]').type('jefflau')
      cy.get('[data-testid="search-button"]', {
        timeout: 100000,
      }).click()
    })

    it('should show the details button on the profile page, and correctly link to the details page', () => {
      cy.contains('View Details').click()
      cy.url().should(
        'contain',
        'http://localhost:3000/profile/jefflau.eth/details',
      )
    })

    it('should show the text records', () => {
      cy.contains('Text').should('be.visible')
      cy.contains('Hello2').should('be.visible')
    })
    it('should show the address records', () => {
      cy.contains('ETH').should('be.visible')
      cy.contains('0x866B3c4994e1416B7C738B9818b31dC246b95eEE').should(
        'be.visible',
      )
    })
    it('should have correct controller/registrant data', () => {
      cy.findByTestId('controller-data').should('contain.text', 'jefflau.eth')
      cy.findByTestId('registrant-data').should('contain.text', 'jefflau.eth')
    })
    it('should show the expiry date of the name', () => {
      cy.findByTestId('expiry-data').should('contain.text', 'April 25, 2023')
    })
    it('should show profile data', () => {
      cy.contains('Hello2').should('be.visible')
      cy.contains('twitter.com').should('be.visible')
    })
    it('should show the back button, and allow user to go back', () => {
      cy.findByTestId('back-button').click()
      cy.url().should('eq', 'http://localhost:3000/profile/jefflau.eth')
    })
  })
})
