import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

const newResolver = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49'
const oldResolver = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'

describe('Profile Editor', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  describe('unwrapped', () => {
    describe('migration', () => {
      it('should force a name on the old registry to go to update registry', () => {
        cy.visit('/legacy.test')
        connectFromExisting()
        cy.contains('Edit profile').click()
        cy.findByTestId('warning-overlay').should('be.visible')
        cy.contains('Your registry is out of date').should('be.visible')
        cy.findByTestId('dismiss-dialog-button').should('exist').click()
        cy.findByTestId('profile-editor').should('not.exist')
      })

      it('should force a name without a resolver to update their resolver', () => {
        cy.visit('/tld/reverse')
        connectFromExisting()

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('not.have.text', newResolver)

        // Closing overlay button should close editor
        cy.findByTestId('profile-tab').click()
        cy.contains('Edit profile').click()
        cy.findByTestId('warning-overlay').should('be.visible')
        cy.contains('No resolver assigned').should('be.visible')
        cy.findByTestId('dismiss-dialog-button').should('exist').click()
        cy.findByTestId('profile-editor').should('not.exist')

        cy.contains('Edit profile').click()
        cy.findByTestId('profile-editor-overlay-button').click()
        cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.wait(10000)

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', newResolver)
      })

      it('should check if a name has been migrated, but whose resolver has not been migrated', () => {
        cy.visit('/migrated-resolver-to-be-updated.eth')
        connectFromExisting()

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', oldResolver)

        cy.findByTestId('profile-tab').click()

        // Check profile records
        cy.findByTestId('profile-snippet-description').should('have.text', 'Hello2')
        cy.findByTestId('profile-snippet-url').should('have.text', 'twitter.com')
        cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')
        cy.findByTestId('address-profile-button-btc').should('have.text', 'bc1qj...pwa6n')
        cy.findByTestId('other-profile-button-ETC_LEGACY').should('have.text', '0x3C4...293BC')
        cy.findByTestId('other-profile-button-email').should('have.text', 'fakeemail@fake....')

        cy.contains('Edit profile').click()
        cy.findByTestId('warning-overlay').should('be.visible')
        cy.get('button').contains('Update').click()
        cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.wait(10000)

        // Check profile records
        cy.findByTestId('profile-snippet-description').should('have.text', 'Hello2')
        cy.findByTestId('profile-snippet-url').should('have.text', 'twitter.com')
        cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')
        cy.findByTestId('address-profile-button-btc').should('have.text', 'bc1qj...pwa6n')
        cy.findByTestId('other-profile-button-ETC_LEGACY').should('have.text', '0x3C4...293BC')
        cy.findByTestId('other-profile-button-email').should('have.text', 'fakeemail@fake....')

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', newResolver)
      })

      it('should be able to migrate unwrapped to new resolver', () => {
        cy.visit('/test123.eth')
        connectFromExisting()

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', oldResolver)

        cy.findByTestId('profile-tab').click()

          // Check profile records
          cy.findByTestId('profile-snippet-description').should('have.text', 'Hello2')
          cy.findByTestId('profile-snippet-url').should('have.text', 'twitter.com')
          cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')
          cy.findByTestId('address-profile-button-btc').should('have.text', 'bc1qj...pwa6n')
          cy.findByTestId('other-profile-button-ETC_LEGACY').should('have.text', '0x3C4...293BC')
          cy.findByTestId('other-profile-button-email').should('have.text', 'fakeemail@fake....')

        cy.contains('Edit profile').click()
        cy.findByTestId('warning-overlay').should('be.visible')
        cy.get('dismiss-dialog-button').should('be.visible')
        cy.get('button').contains('Update').click()
        cy.findByTestId('transfer-profile-trailing-btn').should('not.be.disabled').click()
        cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.wait(10000)
        cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.wait(10000)

         // Check profile records
         cy.findByTestId('profile-snippet-description').should('have.text', 'Hello2')
         cy.findByTestId('profile-snippet-url').should('have.text', 'twitter.com')
         cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')
         cy.findByTestId('address-profile-button-btc').should('have.text', 'bc1qj...pwa6n')
         cy.findByTestId('other-profile-button-ETC_LEGACY').should('have.text', '0x3C4...293BC')
         cy.findByTestId('other-profile-button-email').should('have.text', 'fakeemail@fake....')

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', newResolver)
      })
    })

    it('should be able to update profile and migrate resolver', () => {
      cy.visit('/to-be-wrapped.eth')
      connectFromExisting()

      cy.findByTestId('more-tab').click()
      cy.findByTestId('name-details-text').should('have.text', oldResolver)

      cy.findByTestId('profile-tab').click()

        // Check profile records
        cy.findByTestId('profile-snippet-description').should('have.text', 'Hello2')
        cy.findByTestId('profile-snippet-url').should('have.text', 'twitter.com')
        cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')
        cy.findByTestId('address-profile-button-btc').should('have.text', 'bc1qj...pwa6n')
        cy.findByTestId('other-profile-button-ETC_LEGACY').should('have.text', '0x3C4...293BC')
        cy.findByTestId('other-profile-button-email').should('have.text', 'fakeemail@fake....')

      // Update and add records to test migration records merge
      cy.contains('Edit profile').click()
      cy.findByTestId('warning-overlay').should('be.visible')
      cy.get('dismiss-dialog-button').should('be.visible').click()
      cy.findByTestId('profile-record-input-description').get('textarea').type('{selectall}{backspace}new name')
      cy.findByTestId('profile-record-input-ETH').get('input').type('{selectall}{backspace}0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
      cy.findByTestId('profile-submit-button').should('not.be.disabled').click()
      cy.findByTestId('show-add-profile-records-modal-button').click({ force: true })
      cy.findByTestId('profile-record-option-com.twitter').click()
      cy.findByTestId('add-profile-records-button').should('not.be.disabled').click()
      cy.findByTestId('profile-record-input-com.twitter').get('input').type('elonmusk')

      cy.findByTestId('profile-submit-button').should('not.be.disabled').click()
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
      cy.confirmMetamaskTransaction()
      

    })

    it.todo('should be able update profile')
  })

  describe('wrapped', () => {
    describe('migration', () => {
      it('should be able to migrate wrapped name to new resolver', () => {
        cy.visit('/wrapped.eth')
        cy.findByTestId('more-tab').click()
        cy.findByTestId('edit-resolver-button').click()
        cy.findByTestId('custom-resolver-radio').should('not.be.disabled').click()
        cy.findByTestId('dogfood').type(oldResolver)
        cy.findByTestId('update-button').click()
        cy.findByTestId('transaction-modal-confirm-button').click()
        cy.confirmMetamaskTransaction()
        cy.wait(10000)
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.findByTestId('name-details-text').should('have.text', oldResolver)

        cy.findByTestId('profile-tab').click()
        cy.contains('Edit profile').click()
        cy.findByTestId('warning-overlay').should('be.visible')
        cy.get('[data-testid=warning-overlay-dismiss]').should('be.visible')
        cy.get('button').contains('Update').click()
        cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
        cy.confirmMetamaskTransaction()
        cy.findByTestId('transaction-modal-complete-button').click()
        cy.wait(10000)

        cy.findByTestId('more-tab').click()
        cy.findByTestId('name-details-text').should('have.text', newResolver)
      })
    })
    it('should be able to update account', () => {
      cy.visit('/wrapped.eth')
      connectFromExisting()
      cy.contains('Edit profile').click()
      cy.findByPlaceholderText('John Smith').type('Test Name')
      cy.findByTestId('profile-editor-submit')
        .should('contain.text', 'Save')
        .should('not.be.disabled')
        .click()
      cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.reload()
      cy.contains('Test Name').should('be.visible')
    })

    it('should bring existing records and update records to new resolver', () => {
      cy.visit('/other-eth-record.eth')

      // Setup existing records
      cy.findByTestId('records-tab').click()
      cy.contains('Edit Records').click()
      cy.findByTestId('add-record-button-button').click()
      cy.findByTestId('add-record-button-input').type('name')
      cy.findByTestId('add-record-button-action-button').click()
      cy.findByTestId('record-input-input').type('initial name')
      cy.findByTestId('address-tab').click()
      cy.findByTestId('add-record-button-button').click()
      cy.findByTestId('add-record-button-option-SOL').click()
      cy.findByTestId('record-input-SOL')
        .findByTestId('record-input-input')
        .type('HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH')
      cy.findByTestId('advanced-editor-save-button').click()
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.wait(10000)
      cy.findByTestId('transaction-modal-complete-button').click()

      cy.findByTestId('profile-tab').click()
      cy.contains('Edit profile').click()
      cy.findByTestId('warning-overlay-dismiss').click()
      cy.findByTestId('record-input-Nickname')
        .findByTestId('record-input-input')
        .type('{selectall}{backspace}new name')
      cy.findByTestId('profile-editor-submit').should('not.be.disabled').click()
      cy.findByTestId('transaction-dialog-intro-trailing-btn').click()
      cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)
      cy.findByTestId('transaction-modal-confirm-button').click()
      cy.confirmMetamaskTransaction()
      cy.findByTestId('transaction-modal-complete-button').click()
      cy.wait(10000)

      cy.contains('0xf39...92266').should('be.visible')
      cy.contains('new name').should('be.visible')
      cy.contains('HN7cA...4YWrH').should('be.visible')
    })
  })
})
