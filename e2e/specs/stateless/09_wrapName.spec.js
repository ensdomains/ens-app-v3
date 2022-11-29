import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Wrap Name', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })
  it('should not show wrap notification if the connected wallet is not the registrant', () => {
    cy.visit('/profile/other-registrant.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should not show wrap notification if the name is already wrapped', () => {
    cy.visit('/profile/wrapped.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should show wrap notification', () => {
    cy.visit('/profile/to-be-wrapped.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-container').should('be.visible')
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade')
  })
  it('should migrate the profile', () => {
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-modal-inner').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })
  it('should wrap the name', () => {
    // wait so metamask updates the account nonce
    cy.wait(1000)
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })
  it('should remove the notification once the name is wrapped', () => {
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })
  it('should show resume state if wrap steps are incomplete', () => {
    cy.visit('/profile/resume-and-wrap.eth')
    connectFromExisting()
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.findByTestId('close-icon').click()
    cy.findByTestId('wrapper-cta-button').should('contain.text', 'Resume Upgrade')
  })
  it('should open to correctly resumed state', () => {
    cy.wait(1000)
    cy.findByTestId('wrapper-cta-button').click()
    cy.findByTestId('display-item-Step 1-fade').should('be.visible')
    cy.findByTestId('transaction-dialog-intro-trailing-btn').should('contain.text', 'Resume')
  })
  it('should allow resuming the steps', () => {
    cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
  })
  it('should remove the notification once the resumed steps are complete', () => {
    cy.findByTestId('transaction-modal-inner').should('not.exist')
    cy.findByTestId('wrapper-cta-container').should('not.exist')
  })

  describe('subdomain', () => {
    it('should allow wrapping a subdomain', () => {
      cy.visit('/profile/sub.unwrapped-with-wrapped-subnames.eth')
      connectFromExisting()
      cy.findByTestId('wrapper-cta-container').should('be.visible')
      cy.findByTestId('wrapper-cta-button').should('contain.text', 'Upgrade')
    })
    it('should approve name wrapper for address', () => {
      cy.findByTestId('wrapper-cta-button').click()
      cy.findByTestId('transaction-modal-inner').should('be.visible')
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
    })
    it('should wrap the name', () => {
      // arbitrary wait so metamask updates the account nonce
      cy.wait(1000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
    })
    it('should remove the notification once the name is wrapped', () => {
      cy.findByTestId('transaction-modal-inner').should('not.exist')
      cy.findByTestId('wrapper-cta-container').should('not.exist')
    })
  })
})
