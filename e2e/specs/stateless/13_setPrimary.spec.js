import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Set Primary Name from profile page', () => {
  before(() => {
    acceptMetamaskAccess(1, true)
  })

  describe('profile', () => {
    it('should allow setting unmanaged name that has eth record set to address', () => {
      cy.visit('/other-eth-record.eth')
      connectFromExisting()

      // Assert state
      cy.findByTestId('owner-profile-button-name.manager').should(
        'contain.text',
        'manager0x709...c79C8',
      )
      cy.findByTestId('owner-profile-button-name.owner').should(
        'contain.text',
        'owner0x709...c79C8',
      )
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0xf39...92266')

      cy.findByText('Set as primary name').click()

      // Transaction modal
      cy.findByTestId('display-item-info-normal').should('contain.text', 'Set the primary name for your address')
      cy.findByTestId('display-item-name-normal').should('contain.text', 'other-eth-record.eth')
      cy.findByTestId('display-item-address-normal').should('contain.text', '0xf39...92266')
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      
      // Assertion
      cy.findByTestId('profile-title').should('contain.text', 'other-eth-record.eth')
    })

    it('should show changes in settings', () => {
      cy.visit('/')
      connectFromExisting()
      cy.wait(1000)
      cy.visit('/my/settings')
      const wrapper = cy.findByTestId('primary-name-label')
      wrapper.should('exist')
      wrapper.should('include.text', 'other-eth-record.eth')
    })

    it('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', () => {
      cy.visit('/other-controller.eth')
      connectFromExisting()

      // Assert state
      cy.findByTestId('address-profile-button-eth').should('contain.text', '0x709...c79C8')
      cy.findByTestId('owner-profile-button-name.manager').should(
        'contain.text',
        'managerother-eth-record.eth',
      )
      cy.findByTestId('owner-profile-button-name.owner').should(
        'contain.text',
        'owner0x709...c79C8',
        )

      cy.findByText('Set as primary name').click()

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
      cy.findByTestId('profile-title').should('contain.text', 'other-controller.eth')
    })

    it('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user with an owned resolver', () => {
      cy.visit('/sub.wrapped-without-resolver.eth')
      connectFromExisting()

      // Set resolver to unauthorized resolver
      cy.findByTestId('more-tab').click()
      cy.findByTestId('edit-resolver-button').click()
      cy.findByTestId('custom-resolver-radio').click()
      cy.findByTestId('dogfood').type('0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB')
      cy.findByTestId('update-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      // Assert state
      cy.findByTestId('profile-tab').click()
      cy.findByTestId('owner-profile-button-name.manager').should('have.text', 'managerother-controller.eth')
      cy.findByTestId('address-profile-button-eth').should('not.exist')

      cy.findByText('Set as primary name').click()

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
      cy.findByTestId('profile-title').should('contain.text', 'sub.wrapped-without-resolver.eth')
    })

    it('should allow setting primary name from name with encrypted label', () => {
      cy.clearLocalStorage()
      acceptMetamaskAccess(3)
      cy.visit(
        '/[5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04].unknown-labels.eth',
      )

      // Assert state
      cy.findByTestId('owner-profile-button-name.manager').should('have.text', 'manager0x3C4...293BC')

      cy.findByText('Set as primary name').click()
      cy.findByTestId(
        'unknown-label-input-0x5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04',
      ).type('aaa123xyz000')
      cy.findByTestId('unknown-labels-confirm').should('be.enabled').click()

      // cy.location('pathname').should('equal', '/aaa123xyz000.unknown-labels.eth')
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

      cy.wait(10000)

      cy.findByTestId('profile-title').should('contain.text', 'aaa123xyz000.unknown-labels.eth')
    })
  })

  describe('subgraph error', () => {
    it('should be able to set error', () => {
      
    })
  })
  
})
