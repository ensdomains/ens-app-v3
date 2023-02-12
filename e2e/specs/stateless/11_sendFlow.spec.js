import { acceptMetamaskAccess } from '../../setup'

const accountOneShort = '0xf39...92266'

describe('Send Flow', () => {
    before(() => {
      acceptMetamaskAccess(2, true)
    })
  
  describe('Unwrapped name', () => {
    it('should NOT show send button when parent is owner and not manager', () => {
      cy.visit('/test123.eth')
      cy.findByText('More').click({ force: true })
      cy.wait(1000)
      cy.findByText('Send').click()

      cy.findByTestId('owner-checkbox').click()
      cy.findByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      cy.wait(1000)
      cy.findByText('Next').click()
      cy.findByTestId('transaction-modal-confirm-button', { timeout: 5000 }).click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByTestId('owner-button-name-name.manager', { timeout: 5000 }).should(
        'have.text',
        accountOneShort,
      )

      cy.wait(1000)
      cy.visit('/sub.test123.eth')
      cy.findByText('More').click({ force: true })
      cy.findByText('Send').should('not.exist')
    })
  })

  describe('Unwrapped subnames', () => {
    it('Should allow unwrapped subname to be sent by owner (setOwner)', () => {
      acceptMetamaskAccess(2)
      cy.visit('/sub.test123.eth')
      cy.findByText('More').click({ force: true })
      cy.findByText('Send').click()
      cy.findByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByTestId('owner-button-name-name.manager').should('have.text', '0xf39...92266')
    })

    it('Should allow unwrapped subname to be sent by unwrapped parent owner (setSubnodeOwner)', () => {
      acceptMetamaskAccess(2)
      cy.visit('/sub.test123.eth')
      cy.findByText('More').click({ force: true })
      cy.findByText('Send').click()
      cy.findByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByTestId('owner-button-name-name.manager').should('have.text', '0x709...c79C8')
    })

    it('should NOT show send button when subname is wrapped and parent is unwrapped', () => {
      cy.visit('/sub.test123.eth')
      cy.findByText('More').click({ force: true })
      cy.findByTestId('wrapper-cta-button').click()
      cy.findByTestId('transaction-modal-inner').should('be.visible')
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskPermissionToSpend()
      cy.wait(10000)
      cy.findByTestId('transaction-modal-complete-button').click()

      // wait so metamask updates the account nonce
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.findByText('Send').click()
      cy.findByTestId('dogfood').type('0x32518828A071a0e6E549F989D4aaB4Cd7401be8f')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click({ force: true })
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByText('Send').should('not.exist')
    })
  })

  describe('Wrapped name', () => {
    it('Should allow namewrapper owner to send name', () => {
      cy.visit('/wrapped.eth')
      acceptMetamaskAccess(2)
      cy.visit('/wrapped.eth')
      cy.findByText('More').click({ force: true })
      cy.findByText('Send').click()
      cy.findByText('make owner').should('be.visible')
      cy.findByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByTestId('owner-button-name-name.owner').should('have.text', '0xf39...92266')
    })
  })

  describe('Wrapped subnames', () => {
    it('should allow namewrapper subname owner to send name', () => {
      acceptMetamaskAccess(1)
      cy.visit('/sub.wrapped.eth')
      cy.findByText('More').click({ force: true })
      cy.findByText('Send').click()
      cy.findByText('Make manager').should('be.visible')
      cy.findByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.findByTestId('owner-button-name-name.manager').should('have.text', '0x709...c79C8')
    })

    // Propbably won't work since wrapper.eth ownership was changed earlier
    it('should allow parent owner to send name', () => {
      acceptMetamaskAccess(2)
      cy.visit('/test.wrapped.eth')
      cy.findByTestId('more-tab').click()
      cy.findByTestId('button-send-ownership').click()
      cy.findByText('Make owner').should('be.visible')
      cy.findByTestId('dogfood').type('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.findByTestId('owner-button-name-name.manager').should('have.text', '0xf39...92266')
    })
  })

  describe('Wrapped subname with PCC burned', () => {
    it('should allow PCC to be burned', () => {
      acceptMetamaskAccess(2)
      cy.visit('/wrapped.eth')
      cy.findByTestId('permissions-tab').click()
      cy.findByTestId('button-revoke-permissions').click()
      cy.findByTestId('permissions-next-button').click()
      cy.findByTestId('checkbox-CANNOT_UNWRAP').click()
      cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
      cy.findByTestId('permissions-next-button').should('have.text', 'Skip0').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.visit('/legacy.wrapped.eth')
      cy.findByTestId('permissions-tab').click()
      cy.findByTestId('button-revoke-pcc').click()
      cy.findByTestId('permissions-next-button').click()
      cy.findByTestId('checkbox-pcc').click()
      cy.findByTestId('permissions-next-button').should('not.be.disabled').click()
      cy.findByText('Set name expiry').should('be.visible')
      cy.findByTestId('permissions-next-button').click()
      cy.findByTestId('permissions-next-button').should('have.text', 'Skip0').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
    })

    it('should NOT allow parent owner to transfer', () => {
      acceptMetamaskAccess(2)
      cy.visit('/legacy.wrapped.eth')
      cy.findByTestId('more-tab').click()
      cy.findByTestId('button-send-ownership').should('not.exist')
    })

    it('should allow name owner to transfer', () => {
      acceptMetamaskAccess(1)
      cy.visit('/legacy.wrapped.eth')
      cy.findByTestId('more-tab').click()
      cy.findByTestId('button-send-ownership').click()
      cy.findByText('Make owner').should('be.visible')
      cy.findByTestId('dogfood').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      cy.findByText('Next').click()
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.findByTestId('profile-tab').click()
      cy.findByTestId('owner-profile-button-name.owner').should('have.text', 'owner0x709...c79C8')
    })
  })
})
