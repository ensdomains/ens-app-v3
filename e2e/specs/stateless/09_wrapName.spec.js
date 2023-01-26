import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Wrap Name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should not show wrap notification if the connected wallet is not the registrant', () => {
    cy.visit('/other-registrant.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should not show wrap notification if the name is already wrapped', () => {
    cy.visit('/wrapped.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should show wrap notification on unwrapped name', () => {
    cy.visit('/to-be-wrapped.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('be.visible')
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade')
  })
  it('should wrap name', () => {
    cy.visit('/to-be-wrapped.eth')
    connectFromExisting()

    // should migrate the profile
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-modal-inner').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should wrap the name
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should remove the notification once the name is wrapped
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should show resume state if wrap steps are incomplete', () => {
    cy.visit('/resume-and-wrap.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('toast-close-icon').click()
    cy.findAllByTestId('close-icon').last().click()
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Resume Upgrade')

    // should open to correctly resumed state
    cy.wait(1000)
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('display-item-Step 1-fade').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').should('contain.text', 'Resume')

    // should allow resuming the steps
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should remove the notification once the resumed steps are complete
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should allow wrapping a subdomain', () => {
    cy.visit('/sub.unwrapped-with-wrapped-subnames.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('be.visible')
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade')

    // should approve name wrapper for address
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-modal-inner').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for name wrapper approval')
    cy.confirmMetamaskPermissionToSpend()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should wrap the name
    // arbitrary wait so metamask updates the account nonce
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for wrapping name')
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    // should remove the notification once the name is wrapped
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should allow wrapping a name with an unknown label', () => {
    acceptMetamaskAccess(3, false)
    cy.visit(
      '/[5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04].unknown-labels.eth',
    )
    cy.findByTestId('wrapper-cta-container').should('be.visible')
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade').click()

    const input = cy.findByTestId(
      'unknown-label-input-0x5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04',
    )

    // fail to confirm with invalid label
    input.click().type('failure')
    cy.findByText('Label is incorrect').should('be.visible')
    cy.findByTestId('unknown-labels-confirm').should('be.disabled')

    input.click().clear().type('aaa123xyz000')
    cy.findByTestId('unknown-labels-confirm').should('be.enabled').click()

    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-modal-inner').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for name wrapper approval')
    cy.confirmMetamaskPermissionToSpend()
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.log('Confirm metamask transaction for wrapping name')
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')

    // should direct to the known label page
    cy.url().should('contain', 'aaa123xyz000.unknown-labels.eth')
  })
})
