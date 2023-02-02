import { acceptMetamaskAccess } from "../../setup";

describe('Permissions', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  
  it('should show parent not locked warning', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('banner-parent-not-locked').click()
  })

  it('should allow owner to revoke permissions', () => {
    cy.findByTestId('button-revoke-permissions').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CANNOT_UNWRAP').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()

    const fuses = ['CANNOT_CREATE_SUBDOMAIN', 'CANNOT_TRANSFER', 'CANNOT_SET_RESOLVER', 'CANNOT_SET_TTL']
    for (const fuse of fuses) {
      cy.findByTestId(`checkbox-${fuse}`).click()
    }
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })

  it('should allow parent owner to extend expiry', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('button-extend-expiry').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CAN_EXTEND_EXPIRY').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByTestId('radio-custom').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })

  it('should allow parent owner to burn pcc', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('button-revoke-pcc').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-pcc').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByTestId('radio-max').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CANNOT_UNWRAP').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })

  it('should allow name owner to revoke permissions', () => {
    cy.clearLocalStorage()
    acceptMetamaskAccess(1)
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.wait(5000)
    cy.findByTestId('button-revoke-permissions').click()
    cy.findByTestId('permissions-next-button').click()
    const fuses = ['CANNOT_CREATE_SUBDOMAIN', 'CANNOT_TRANSFER']
    for (const fuse of fuses) {
      cy.findByTestId(`checkbox-${fuse}`).click()
    }
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })

  it('should allow name owner to revoke change fuses', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('button-revoke-change-fuses').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CANNOT_BURN_FUSES').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByText('Remaining permissions will be locked').should('be.visible')
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })

})