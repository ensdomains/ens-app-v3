import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

const newResolver = '0x70e0bA845a1A0F2DA3359C97E0285013525FFC49'
const oldResolver = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'

describe('Profile Editor', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  it('should force a name on the old registry to go to update registry', () => {
    cy.visit('/legacy.test')
    connectFromExisting()
    cy.contains('Edit profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.contains('Your registry is out of date').should('be.visible')
    cy.findByTestId('warning-overlay-dismiss').should('exist').click()
    cy.findByTestId('profile-editor').should('not.exist')
  })

  it('should force a user without a resolver set to migrate resolver', () => {
    cy.visit('/tld/reverse')
    connectFromExisting()

    cy.findByTestId('more-tab').click()
    cy.findByTestId('name-details-text').should('not.have.text', newResolver)

    cy.findByTestId('profile-tab').click()
    cy.contains('Edit profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.contains('No resolver assigned').should('be.visible')
    cy.findByTestId('warning-overlay-dismiss').should('exist').click()
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

  it('should be able to update resolver if profile has been migrated but resolver has not been updated', () => {
    cy.visit('/migrated-resolver-to-be-updated.eth')
    connectFromExisting()

    cy.findByTestId('more-tab').click()
    cy.findByTestId('name-details-text').should('have.text', oldResolver)

    cy.findByTestId('profile-tab').click()
    cy.contains('Edit profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('button').contains('Update').click()
    cy.findByTestId('transaction-modal-confirm-button').should('not.be.disabled').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()
    cy.wait(10000)

    cy.findByTestId('more-tab').click()
    cy.findByTestId('name-details-text').should('have.text', newResolver)
  })

  it('should be able to migrate unwrapped to new resolver', () => {
    cy.visit('/test123.eth')
    connectFromExisting()

    cy.findByTestId('more-tab').click()
    cy.findByTestId('name-details-text').should('have.text', oldResolver)

    cy.findByTestId('profile-tab').click()
    cy.contains('Edit profile').click()
    cy.findByTestId('warning-overlay').should('be.visible')
    cy.get('[data-testid=warning-overlay-dismiss]').should('be.visible')
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
    cy.findByTestId('address-profile-button-eth').should('have.text', '0x709...c79C8')

    cy.findByTestId('more-tab').click()
    cy.findByTestId('name-details-text').should('have.text', newResolver)
  })

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

  it('should be able to update account', () => {
    cy.visit('/wrapped.eth')
    connectFromExisting()
    cy.contains('Edit profile').click()
    cy.findByPlaceholderText('John Smith').type('Test Name')
    cy.findByTestId('profile-editor-submit').should('contain.text', 'Save').should('not.be.disabled').click()
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
    cy.findByTestId('record-input-SOL').findByTestId('record-input-input').type('HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH')
    cy.findByTestId('advanced-editor-save-button').click()
    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.wait(10000)
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.findByTestId('profile-tab').click()
    cy.contains('Edit profile').click()
    cy.findByTestId('warning-overlay-dismiss').click()
    cy.findByTestId('record-input-Nickname').findByTestId('record-input-input').type('{selectall}{backspace}new name')
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
