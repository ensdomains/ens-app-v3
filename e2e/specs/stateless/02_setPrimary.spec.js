import { acceptMetamaskAccess } from '../../setup'

describe('Set Primary Name from settings', () => {
  before(() => {
    acceptMetamaskAccess(1, true)
  })

  describe('header without primary name', () => {
    it('should not show profile button in header dropdown', () => {
      cy.visit('/')
      cy.findByTestId('header-profile').as('header-profile')
      cy.get('@header-profile').click()
      // length 4 = 3 buttons + 1 divider
      cy.findByTestId('dropdown-menu').children().first().children().should('have.length', 4)
    })
  })

  describe('settings', () => {
    it('should show no primary message if no primary is set in settings', () => {
      cy.visit('/my/settings')
      cy.findByTestId('no-primary-name-section').should('be.visible')
    })

    it('should allow setting unmanaged name that has eth record set to address', () => {
      cy.visit('/my/settings')
      cy.findByTestId('set-primary-name-button').click()
      cy.findByTestId('name-table-header-search').type('other')
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
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-sub.wrapped-without-resolver.eth')
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
      cy.findByTestId('primary-name-label').should(
        'contain.text',
        'sub.wrapped-without-resolver.eth',
      )
    })

    it('should allow setting a wrapped name that user is manager of but whose resolver is not valid', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(2)

      // Set resolver to invalid resolver
      cy.visit('/wrapped-without-resolver.eth?tab=more')
      cy.findByTestId('edit-resolver-button').click()
      cy.findByTestId('custom-resolver-radio').click()
      cy.findByTestId('dogfood').type('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')
      cy.findByTestId('update-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Set primary name
      cy.visit('/my/settings')
      cy.findByTestId('set-primary-name-button').click()
      cy.findByTestId('name-table-header-search').type('wrapped-without')
      cy.findByTestId('name-item-wrapped-without-resolver.eth')
        .within(() => {
          cy.findByTestId('tag-name.owner-true').should('be.visible')
        })
        .click()
      cy.findByTestId('primary-next').click()

      // Intro modal
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

      // Migrate profile and update eth address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // Set Resolver modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      // Set Primary Name modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.wait(10000)

      // Assertion
      cy.findByTestId('primary-name-label').should('contain.text', 'wrapped-without-resolver.eth')

    })

    it('should not show current primary name in list', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-table-header-search').type('wrapped-without')
      cy.findByTestId('name-item-wrapped-without-resolver.eth').should('not.exist')
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

    it('should allow setting primary name from name with encrypted label', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(3)

      cy.visit('/my/settings')

      cy.findByTestId('set-primary-name-button').click()

      // Search header should not exist
      cy.findByTestId('name-table-header-search').should('not.exist')

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

  describe('header with primary name', () => {
    it('should not show profile button in header dropdown', () => {
      cy.visit('/')
      cy.findByTestId('header-profile').as('header-profile')
      cy.get('@header-profile').click()
      // length 4 = 3 buttons + 1 divider
      cy.findByTestId('dropdown-menu').children().first().children().should('have.length', 5)
    })
  })
})
