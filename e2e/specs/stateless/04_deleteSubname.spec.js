import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Delete subnames', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  
  describe('unwrapped', () => {
    it('allows deletion when parent owner but NOT child owner', () => {
      cy.visit('/parent-not-child.unwrapped-to-delete.eth')
      connectFromExisting()

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })

    it('allows deletion when parent owner and child owner', () => {
      cy.visit('/parent-child.unwrapped-to-delete.eth')
      connectFromExisting()

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })

    it('allows deletion when NOT parent owner, but child owner', () => {
      acceptMetamaskAccess(1)
      cy.visit('/not-parent-child.unwrapped-to-delete.eth')

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('delete-subname-not-parent-button', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })
  })

  describe('wrapped', () => {
    before(() => {
      acceptMetamaskAccess(2)
    })

    it('allows deletion when parent owner but NOT child owner', () => {
      cy.visit('/parent-not-child.wrapped-to-delete.eth')
      connectFromExisting()

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })

    it('allows deletion when parent owner and child owner', () => {
      cy.visit('/parent-child.wrapped-to-delete.eth')
      connectFromExisting()

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })
    
    it('allows deletion when NOT parent owner, but child owner', () => {
      acceptMetamaskAccess(1)
      cy.visit('/not-parent-child.wrapped-to-delete.eth')

      // Manager button should exist
      cy.findByTestId('owner-profile-button-name.manager').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('delete-subname-not-parent-button', { timeout: 10000 }).click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Button should not exist
      cy.findByTestId('owner-profile-button-name.manager').should('not.exist')
    })
  })

  describe('emancipated', () => {
    before(() => {
      acceptMetamaskAccess(2, true)
    })

    it('does NOT allow deletion when parent owner but NOT child owner', () => {
      cy.visit('/parent-not-child.emancipated-to-delete.eth')
      connectFromExisting()

      cy.wait(10000)

      // Owner button should exist
      cy.findByTestId('owner-profile-button-name.owner').should('be.visible')

      // Delete should not exist
      cy.findByTestId('profile-action-Delete subname').should('not.exist')
    })

    it('allows deletion when parent owner and child owner', () => {
      cy.visit('/parent-child.emancipated-to-delete.eth')
      connectFromExisting()

      // Owner button should exist
      cy.findByTestId('owner-profile-button-name.owner').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('delete-emancipated-subname-button', { timeout: 10000 }).should('not.be.disabled').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Owner button should not exist
      cy.findByTestId('owner-profile-button-name.owner', { timeout: 10000 }).should('not.exist')
    })

    it('allows deletion when NOT parent owner, but child owner', () => {
      acceptMetamaskAccess(1)
      cy.visit('/not-parent-child.emancipated-to-delete.eth')

      // Owner button should exist
      cy.findByTestId('owner-profile-button-name.owner').should('be.visible')

      cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).click()
      cy.findByTestId('delete-emancipated-subname-button', { timeout: 10000 }).should('not.be.disabled').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Owner button should not exist
      cy.findByTestId('owner-profile-button-name.owner', { timeout: 10000 }).should('not.exist')
    })
  })

  it('should not allow parent owner to delete if PCC is expired', () => {
    // this is because once PCC expires, the name is effectively deleted
    acceptMetamaskAccess(2)
    cy.visit('/day-expired.wrapped-expired-subnames.eth')
    cy.findByTestId('profile-action-Delete subname', { timeout: 10000 }).should('not.exist')
  })

  describe('subgraph errors', () => {
    it('should be able to turn on subgraph indexing error', () => {
      cy.visit('/my/settings')
      cy.findByTestId('subgraph-indexing-error').click()
    })

    it('should disable delete button for unwrapped subname', () => {
      cy.visit('/legacy.with-subnames.eth')
      cy.findByTestId('disabled-profile-action-Delete subname').should('be.visible')
    })

    it('should disable delete button for wrapped subname', () => {
      cy.visit('/legacy.wrapped.eth')
      cy.findByTestId('disabled-profile-action-Delete subname').should('be.visible')
    })
  })
})
