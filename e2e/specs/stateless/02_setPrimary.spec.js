import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Set Primary Name from settings', () => {
  before(() => {
    acceptMetamaskAccess(1, true)
  })

  describe('settings', () => {
    it('should show no primary message if no primary is set in settings', () => {
      cy.visit('/my/settings')
      connectFromExisting()
      cy.findByTestId('no-primary-name-section').should('be.visible')
    })

    it('should not show profile button in header dropdown', () => {
      cy.visit('/my/settings')
      connectFromExisting()
      cy.findByTestId('header-profile').as('header-profile')
      cy.get('@header-profile').click()
      // length 4 = 3 buttons + 1 divider
      cy.findByTestId('dropdown-menu').children().first().children().should('have.length', 4)
    })

    it('should allow setting unmanaged name that has eth record set to address', () => {
      cy.visit('/my/settings')
      connectFromExisting()
      cy.findByTestId('set-primary-name-button').click()
      // cy.findByTestId('name-table-header-search').type('other')
      cy.findByTestId('name-item-other-eth-record.eth')
        .within(() => {
          cy.findByTestId('tag-name.manager-false').should('be.visible')
          cy.findByTestId('tag-name.owner-false').should('be.visible')
        })
        .click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.wait(10000)

      // Assertions
      cy.findByTestId('primary-name-section').should('be.visible')
      cy.findByTestId('primary-name-label').should('contain.text', 'other-eth-record.eth')
    })

    it('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', () => {
      cy.visit('/my/settings')
      connectFromExisting()
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-other-controller.eth')
        .within(() => {
          cy.findByTestId('tag-name.manager-true').should('be.visible')
          cy.findByTestId('tag-name.owner-false').should('be.visible')
        })
        .click()
      cy.findByTestId('primary-next').click()

      // Intro modal
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

      // Update Eth Address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // Set Primary Name modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.wait(10000)

      // Assertion
      cy.findByTestId('primary-name-label').should('contain.text', 'other-controller.eth')
    })

    it('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user and has a owned resolver', () => {
      // Set resolver to unauthorized resolver
      cy.visit('/sub.wrapped.eth?tab=more')
      connectFromExisting()
      cy.findByTestId('edit-resolver-button').click()
      cy.findByTestId('custom-resolver-radio').click()
      cy.findByTestId('dogfood').type('0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB')
      cy.findByTestId('update-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Set primary name
      cy.visit('/my/settings')

      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-sub.wrapped.eth')
        .within(() => {
          cy.findByTestId('tag-name.manager-true').should('be.visible')
        })
        .click()
      cy.findByTestId('primary-next').click()

      // Intro modal
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

      // Migrate and Update Eth Address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // Update resolver
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // Set Primary Name modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.wait(10000)

      // Assertion
      cy.findByTestId('primary-name-label').should('contain.text', 'sub.wrapped.eth')
    })

    it('should skip set eth record step when setting a name where the user is manager and whose resolved address is not the same as the user and the resolver is unauthorized if the latest resolver already has the eth record set to user address', () => {
      // Set profile record to user address
      cy.visit('/legacy.wrapped.eth')
      connectFromExisting()
      cy.findByTestId('profile-action-Edit profile').click()
      cy.findByTestId('show-add-profile-records-modal-button').click()
      cy.findByTestId('profile-record-option-ETH').click()
      cy.findByTestId('add-profile-records-button').click()
      cy.findByTestId('profile-record-input-input-ETH').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      cy.findByTestId('profile-submit-button').should('be.enabled').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

       // Set resolver to unauthorized resolver
       cy.visit('/legacy.wrapped.eth?tab=more')
       cy.findByTestId('edit-resolver-button').click()
       cy.findByTestId('custom-resolver-radio').click()
       cy.findByTestId('dogfood').type('0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB')
       cy.findByTestId('update-button').click()
       cy.findByTestId('transaction-modal-confirm-button').click()
       cy.confirmMetamaskTransaction()
       cy.findByTestId('transaction-modal-complete-button').click()
       cy.wait(10000)
 
       // Set primary name
       cy.visit('/my/settings')
 
       cy.findByTestId('change-primary-name-button').click()
       cy.findByTestId('name-item-legacy.wrapped.eth')
         .within(() => {
           cy.findByTestId('tag-name.manager-true').should('be.visible')
         })
         .click()
       cy.findByTestId('primary-next').click()
 
       // Intro modal
       cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
 
       // Update resolver
       cy.findByTestId('transaction-modal-confirm-button').click()
       cy.confirmMetamaskTransaction()
       cy.findByTestId('transaction-modal-complete-button').click()
 
       // Set Primary Name modal
       cy.findByTestId('transaction-modal-confirm-button').click()
       cy.confirmMetamaskTransaction()
       cy.findByTestId('transaction-modal-complete-button').click()
 
       cy.wait(10000)
 
       // Assertion
       cy.findByTestId('primary-name-label').should('contain.text', 'sub.wrapped.eth')
    })

    it('should not show current primary name in list', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-sub.wrapped.eth').should('not.exist')
    })

    it('should allow resetting primary name', () => {
      cy.visit('/my/settings')
      cy.findByTestId('reset-primary-name-button').click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.findByTestId('no-primary-name-section').should('be.visible')
    })

    it('should not show a wrapped name where CSR is burned, resolver is not authorized, and is not a resolved address', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(2)
      cy.visit('/my/settings')

      // Validate that the name is in the list
      cy.findByTestId('set-primary-name-button').click()
      cy.findByTestId('name-table-header-search').type('wrapped.eth')
      cy.findByTestId('name-item-wrapped.eth').should('exist')
      cy.findByTestId('close-icon').click()

      // Set resolver to unauthorized resolver
      cy.visit('/wrapped.eth?tab=more')
      cy.findByTestId('edit-resolver-button').click()
      cy.findByTestId('custom-resolver-radio').click()
      cy.findByTestId('dogfood').type('0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB')
      cy.findByTestId('update-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Validate that the name is in the list
      cy.visit('/my/settings')
      cy.findByTestId('set-primary-name-button').click()
      cy.findByTestId('name-table-header-search').type('wrapped.eth')
      cy.findByTestId('name-item-wrapped.eth').should('exist')
      cy.findByTestId('close-icon').click()

      // Burn CSR fuse
      cy.visit('/wrapped.eth?tab=permissions')
      cy.findByTestId('button-revoke-permissions').click()
      cy.findByTestId('permissions-next-button').click()
      cy.findByTestId('checkbox-CANNOT_UNWRAP').click()
      cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
      cy.findByTestId('checkbox-CANNOT_SET_RESOLVER').click()
      cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

       // Validate that the name is NOT in the list
       cy.visit('/my/settings')
       cy.findByTestId('set-primary-name-button').click()
       cy.findByTestId('name-table-header-search').type('wrapped.eth')
       cy.findByTestId('name-item-wrapped.eth').should('not.exist')
    })

    it('should allow setting primary name from name with encrypted label', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(3)

      cy.visit('/my/settings')

      cy.findByTestId('set-primary-name-button').click()

      cy.findByTestId(
        'name-item-[5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04].unknown-labels.eth',
      ).click()
      cy.findByTestId('primary-next').click()

      // Unknown label modal
      cy.findByTestId(
        'unknown-label-input-0x5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04',
      ).type('aaa123xyz000')
      cy.findByTestId('unknown-labels-confirm').should('be.enabled').click()
      cy.wait(1000)

      // Intro modal
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

      // Update Eth Address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // set primary name
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.wait(10000)

      // Assertion
      cy.findByTestId('primary-name-label').should('have.text', 'aaa123xyz000.unknown-labels.eth')
    })
  })

  describe('subgraph errors', () => {
    it('should disable button for unwrapped subname in profile', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(3)
      cy.visit('/my/settings')
      cy.findByTestId('subgraph-network-error').click()
      cy.reload()
      cy.findByTestId('disabled-change-primary-name-button').should('be.visible')
      cy.findByTestId('disabled-reset-primary-name-button').should('be.visible')
    })

    it('should disable button for wrapped subname in profile', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(1)
      cy.visit('/my/settings')
      cy.findByTestId('subgraph-network-error').click()
      cy.reload()
      cy.findByTestId('disabled-set-primary-name-button').should('be.visible')
    })
  })
})
