import { acceptMetamaskAccess } from '../../setup'

describe('Create Subname', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should not show add subname button when the connected wallet is the registrant but not the controller', () => {
    cy.visit('/other-controller.eth')
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('add-subname-action', { timeout: 2000 }).should('not.exist')
  })
  it('should not show add subname button when the connected wallet does not own the name', () => {
    cy.visit('/other-registrant.eth')
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('add-subname-action', { timeout: 2000 }).should('not.exist')
  })
  it('should show add subname button when the connected wallet owns the name', () => {
    cy.visit('/test123.eth')
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('add-subname-action').click()
  })
  it('should not allow creating a subname with invalid characters', () => {
    cy.findByTestId('add-subname-input').type('test ')
    cy.findByTestId('create-subname-next').should('be.disabled')
    cy.findByText('Contains invalid characters').should('be.visible')
  })
  it('should allow creating a subname', () => {
    cy.findByTestId('add-subname-input').clear().type('test')
    cy.findByTestId('create-subname-next').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByText('test.test123.eth').should('be.visible')
  })
  it('should allow creating a subnames if the user is the wrapped owner', () => {
    acceptMetamaskAccess(2)
    cy.visit('/wrapped.eth')
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('add-subname-action').click()
    cy.findByTestId('add-subname-input').clear().type('subname')
    cy.findByTestId('create-subname-next').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByText('subname.wrapped.eth').should('be.visible')
  })
  it('should not allow adding a subname that already exists', () => {
    cy.visit('/wrapped.eth')
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('add-subname-action').click()
    cy.findByTestId('add-subname-input').clear().type('test')
    cy.findByTestId('create-subname-next').should('be.disabled')
  })
})
