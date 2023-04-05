import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

// SKIP FOR NOW
describe.skip('Set Primary Name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should show no primary message if no primary is set in settings', () => {
    cy.visit('/my/settings')
    cy.findByTestId('no-primary-name').should('be.visible')
  })

  it('should not show profile button in header dropdown', () => {
    cy.findByTestId('header-profile').as('header-profile')
    cy.get('@header-profile').click()
    // length 4 = 3 buttons + 1 divider
    cy.findByTestId('dropdown-menu').children().should('have.length', 4)
  })

  describe('settings', () => {
    acceptMetamaskAccess(1)
    it('should show no primary name set', () => {
      cy.visit('/my/settings')
      cy.findByTestId('no-primary-name-section').should('be.visible')
    })

    it('should allow setting unmanaged name that has eth record set to address', () => {
      cy.visit('/my/settings')
      cy.findByTestId('set-primary-button').click()
      cy.findByTestId('name-table-header-search').type('other')
      cy.findByTestId('name-item-other-eth-record.eth').within(() => {
        cy.findByTestId('tag-name.manager-false').should('be.visible')
        cy.findByTestId('tag-name.owner-false').should('be.visible')
      }).click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('primary-name-section').should('be.visible')
      cy.findByTestId('primary-name-label').should('contain.text', 'other-eth-record.eth')
    })

    it('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-other-controller.eth').within(() => {
        cy.findByTestId('tag-name.manager-true').should('be.visible')
        cy.findByTestId('tag-name.owner-false').should('be.visible')
      }).click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('primary-name-label').should('contain.text', 'other-controller.eth')
    })

    it('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.findByTestId('name-item-sub.wrapped-without-resolver.eth').within(() => {
        cy.findByTestId('tag-name.manager-true').should('be.visible')
      }).click()
      cy.findByTestId('primary-next').click()
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.findByTestId('primary-name-label').should('contain.text', 'sub.wrapped-without-resolver.eth')
    })

    it.todo('should allow setting a name that does not have a resolver --- can not do this until get resolver is updated to reject resolver if it does not support ExtendResolver')

    it('should not show current primary name in list', () => {
      cy.visit('/my/settings')
      cy.findByTestId('change-primary-name-button').click()
      cy.queryByTestId('name-item-sub.wrapped-without-resolver.eth').should('not.exist')
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
  })

  describe('profile', () => {
    describe('differening ETH record', () => {
      it('should show primary name action in profile dropdown', () => {
        cy.visit('/other-eth-record.eth')
        connectFromExisting()
        cy.findByTestId('profile-actions').click()
        cy.findByText('Set as primary name').click()
      })
      it('should show steps', () => {
        cy.wait(350)
        cy.findByText('Set your primary name').should('be.visible')
        cy.findByTestId('display-item-Step 1-normal').should('contain.text', 'Update ETH address')
        cy.findByTestId('display-item-Step 2-normal').should('contain.text', 'Set primary name')
        cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      })
      it('should allow setting ETH record', () => {
        cy.findByTestId('display-item-action-normal').should('contain.text', 'Update ETH address')
        cy.findByTestId('display-item-name-normal').should('contain.text', 'other-eth-record.eth')
        cy.findByTestId('display-item-address-normal').should('contain.text', '0x709...c79C8')
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
      })
      it('should allow setting primary name', () => {
        cy.findByTestId('display-item-action-normal').should('contain.text', 'Set primary name')
        cy.findByTestId('display-item-name-normal').should('contain.text', 'other-eth-record.eth')
        cy.findByTestId('display-item-address-normal').should('contain.text', '0x709...c79C8')
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
      })
      it('should show changes in settings', () => {
        cy.visit('/')
        connectFromExisting()
        cy.wait(1000)
        cy.visit('/my/settings')
        const wrapper = cy.findByTestId('primary-wrapper')
        wrapper.should('exist')
        wrapper.should('include.text', 'other-eth-record.eth')
      })
      it('should allow setting primary name from name with encrypted label', () => {
        acceptMetamaskAccess(3)
        cy.visit(
          '/[5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04].unknown-labels.eth',
        )
        cy.findByText('Set as primary name').click()
        cy.findByTestId(
          'unknown-label-input-0x5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04',
        ).type('aaa123xyz000')
        cy.findByTestId('unknown-labels-confirm').should('be.enabled').click()

        cy.location('pathname').should('equal', '/aaa123xyz000.unknown-labels.eth')
        cy.findByText('Set your primary name').should('be.visible')
        cy.findByTestId('transaction-dialog-intro-trailing-btn').click()

        // update eth address
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()

        // set primary name
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()

        cy.wait(1000)

        cy.findByTestId('header-profile').within(() => {
          cy.findByTestId('profile-title').should('contain.text', 'aaa123xyz000.unknown-labels.eth')
        })
      })
    })
    describe('same ETH record', () => {
      it('should show primary name action in profile dropdown', () => {
        acceptMetamaskAccess(2)
        cy.visit('/test123.eth')
        cy.wait(4000)
        cy.findByTestId('profile-actions').click()
        cy.findByText('Set as primary name').click()
      })
      it('should allow setting primary name', () => {
        cy.wait(350)
        cy.findByTestId('display-item-action-normal').should('contain.text', 'Set primary name')
        cy.findByTestId('display-item-name-normal').should('contain.text', 'test123.eth')
        cy.findByTestId('display-item-address-normal').should('contain.text', '0x709...c79C8')
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.get('[data-testid="notification-continue-button"]').should('not.exist')
      })
      it('should show changes in settings', () => {
        cy.visit('/')
        connectFromExisting()
        cy.wait(1000)
        cy.visit('/my/settings')
        const wrapper = cy.findByTestId('primary-wrapper')
        wrapper.should('exist')
        wrapper.should('include.text', 'test123.eth')
      })
    })
  })
})
