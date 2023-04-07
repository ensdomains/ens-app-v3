import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

const CYPRESS_WAIT_TIME = 10000

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
      cy.wait(CYPRESS_WAIT_TIME)

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
      cy.wait(CYPRESS_WAIT_TIME)

      // Set Primary Name modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)

      // Assertion
      cy.findByTestId('primary-name-label').should('contain.text', 'other-controller.eth')
    })

    it('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user', () => {
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

      // Update Eth Address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)

      // Set Primary Name modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)

      // Assertion
      cy.findByTestId('primary-name-label').should(
        'contain.text',
        'sub.wrapped-without-resolver.eth',
      )
    })

    // it.todo('should allow setting a name that does not have a resolver --- can not do this until get resolver is updated to reject resolver if it does not support ExtendResolver')

    it('should not show current primary name in list', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-sub.wrapped-without-resolver.eth').should('not.exist')
    })

    it('should allow resetting primary name', () => {
      cy.visit('/my/settings')
      cy.findByTestId('reset-primary-name-button').click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)

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

      // Intro modal
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

      // Update Eth Address modal
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)

      // set primary name
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(CYPRESS_WAIT_TIME)
      
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
