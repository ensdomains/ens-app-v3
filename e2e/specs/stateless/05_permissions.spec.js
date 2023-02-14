import { acceptMetamaskAccess } from "../../setup";

const POST_TRANSACTION_WAIT_TIME = 10000;

describe('Permissions', () => {
  before(() => {
    cy.clearLocalStorage()
    acceptMetamaskAccess(2, true)
  })
  
  it('should show parent not locked warning', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('banner-parent-not-locked').click()
    cy.url().should('contain', '/wrapped.eth').should('contain', 'tab=permissions')
  })

  it('should allow owner to revoke permissions', () => {
    cy.visit('/wrapped.eth')

     // Create subname button should be visible
     cy.findByTestId('subnames-tab').click()
     cy.findByTestId('add-subname-action').should('be.visible')
 
     // Edit resolver and send button should be disabled
     cy.findByTestId('more-tab').click()
     cy.findByTestId('send-name-button').should('be.visible')
     cy.findByTestId('edit-resolver-button').should('be.visible')

    // Parent Status
    cy.findByTestId('permissions-tab').click()
    cy.findByTestId('owner-can-change-permissions').should('be.visible')

    // Permissions
    cy.findByTestId('unburned-CANNOT_UNWRAP').should('be.visible')
    cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
    cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
    cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
    cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

    // revoke-permissions flow
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
    cy.wait(POST_TRANSACTION_WAIT_TIME)

    // Permissions
    cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
    cy.findByTestId('burned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
    cy.findByTestId('burned-CANNOT_TRANSFER').should('be.visible')
    cy.findByTestId('burned-CANNOT_SET_RESOLVER').should('be.visible')
    cy.findByTestId('burned-CANNOT_SET_TTL').should('be.visible')

    // Create subname button should be disabled
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('send-name-disabled-button').should('be.visible')

    // Edit resolver and send button should be disabled
    cy.findByTestId('more-tab').click()
    cy.findByTestId('send-name-disabled-button').should('be.visible')
    cy.findByTestId('set-resolver-disabled-button').should('be.visible')
  })

  it('should allow parent owner to extend expiry', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()

    // Parent status
    cy.findByTestId('parent-can-control').should('be.visible')
    cy.findByTestId('parent-can-change-permissions').should('be.visible')
    cy.findByTestId('owner-cannot-extend-expiry').should('be.visible')

     // Permissions
     cy.findByTestId('unburned-CANNOT_UNWRAP').should('be.visible')
     cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
     cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

    cy.findByTestId('button-extend-expiry').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CAN_EXTEND_EXPIRY').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByTestId('radio-custom').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(POST_TRANSACTION_WAIT_TIME)

     // Parent status
     cy.findByTestId('parent-can-control').should('be.visible')
     cy.findByTestId('parent-can-change-permissions').should('be.visible')
     cy.findByTestId('owner-can-extend-expiry').should('be.visible')
 
      // Permissions
      cy.findByTestId('unburned-CANNOT_UNWRAP').should('be.visible')
      cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
      cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
      cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
      cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

      // Button should disappear
      cy.findByTestId('button-extend-expiry').should('not.exist')
  })

  it('should allow parent owner to burn pcc', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()

    // Parent status
    cy.findByTestId('parent-can-control').should('be.visible')
    cy.findByTestId('parent-can-change-permissions').should('be.visible')
    cy.findByTestId('owner-can-extend-expiry').should('be.visible')

     // Permissions
     cy.findByTestId('unburned-CANNOT_UNWRAP').should('be.visible')
     cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
     cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

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
    cy.wait(POST_TRANSACTION_WAIT_TIME)

    // Parent status
    cy.findByTestId('parent-cannot-control').should('be.visible')
    cy.findByTestId('owner-can-change-permissions').should('be.visible')
    cy.findByTestId('owner-can-extend-expiry').should('be.visible')

     // Permissions
     cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
     cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
     cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

    // Button should disappear
    cy.findByTestId('button-revoke-pcc').should('not.exist')
  })

  it('should allow name owner to revoke permissions', () => {
    acceptMetamaskAccess(1)
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()

     // Parent status
     cy.findByTestId('parent-cannot-control').should('be.visible')
     cy.findByTestId('owner-can-change-permissions').should('be.visible')
     cy.findByTestId('owner-can-extend-expiry').should('be.visible')
 
    // Permissions
    cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
    cy.findByTestId('unburned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
    cy.findByTestId('unburned-CANNOT_TRANSFER').should('be.visible')
    cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
    cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

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
    cy.wait(POST_TRANSACTION_WAIT_TIME)

      // Parent status
      cy.findByTestId('parent-cannot-control').should('be.visible')
      cy.findByTestId('owner-can-change-permissions').should('be.visible')
      cy.findByTestId('owner-can-extend-expiry').should('be.visible')
  
     // Permissions
     cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
     cy.findByTestId('burned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
     cy.findByTestId('burned-CANNOT_TRANSFER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
     cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

  })

  it('should allow name owner to revoke change fuses', () => {
    cy.visit('/sub.wrapped.eth')
    cy.findByTestId('permissions-tab').click()

   // Parent status
   cy.findByTestId('parent-cannot-control').should('be.visible')
   cy.findByTestId('owner-can-change-permissions').should('be.visible')
   cy.findByTestId('owner-can-extend-expiry').should('be.visible')

  // Permissions
  cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
  cy.findByTestId('burned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
  cy.findByTestId('burned-CANNOT_TRANSFER').should('be.visible')
  cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
  cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

    cy.findByTestId('button-revoke-change-fuses').click()
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('checkbox-CANNOT_BURN_FUSES').click()
    cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
    cy.findByText('Remaining permissions will be locked').should('be.visible')
    cy.findByTestId('permissions-next-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(POST_TRANSACTION_WAIT_TIME)

       // Parent status
       cy.findByTestId('parent-cannot-control').should('be.visible')
       cy.findByTestId('owner-cannot-change-permissions').should('be.visible')
       cy.findByTestId('owner-can-extend-expiry').should('be.visible')
   
      // Permissions
      cy.findByTestId('burned-CANNOT_UNWRAP').should('be.visible')
      cy.findByTestId('burned-CANNOT_CREATE_SUBDOMAIN').should('be.visible')
      cy.findByTestId('burned-CANNOT_TRANSFER').should('be.visible')
      cy.findByTestId('unburned-CANNOT_SET_RESOLVER').should('be.visible')
      cy.findByTestId('unburned-CANNOT_SET_TTL').should('be.visible')

      // Button should disappear
      cy.findByTestId('button-revoke-change-fuses').should('not.exist')

      // Should have disabled permissions button
      cy.findByTestId('button-revoke-permissions-disabled').should('be.visible')
  })

})