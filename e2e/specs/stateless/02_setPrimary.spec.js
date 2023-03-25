import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Set Primary Name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should show no primary message if no primary is set in settings', () => {
    cy.visit('/my/settings')
    cy.findByTestId('primary-section-text').should('contain.text', 'No primary name set.')
  })

  it('should not show profile button in header dropdown', () => {
    cy.findByTestId('header-profile').as('header-profile')
    cy.get('@header-profile').click()
    // length 4 = 3 buttons + 1 divider
    cy.findByTestId('dropdown-menu').children().should('have.length', 4)
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
  describe('settings', () => {
    it('should show modal', () => {
      cy.findByTestId('primary-section-button').click()
      cy.findByText('Select a primary name').should('exist')
    })
    it('should not show current primary name in list', () => {
      cy.findByTestId('radiogroup').then((el) => {
        cy.wrap(el).findByText('test123.eth').should('not.exist')
      })
    })
    it('should allow setting primary name', () => {
      cy.findByTestId('radiogroup').then((el) => {
        cy.wrap(el).findByText('other-controller.eth').click()
      })
      cy.findByTestId('primary-next').click()
      cy.findByTestId('display-item-action-normal').should('contain.text', 'Set primary name')
      cy.findByTestId('display-item-name-normal').should('contain.text', 'other-controller.eth')
      cy.findByTestId('display-item-address-normal').should('contain.text', '0x709...c79C8')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
    })
    it('should show changes', () => {
      const wrapper = cy.findByTestId('primary-wrapper')
      wrapper.should('exist')
      wrapper.should('include.text', 'other-controller.eth')
    })
  })
})
