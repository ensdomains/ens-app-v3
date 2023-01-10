import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Delete subnames', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  it('should be able to delete subname', () => {
    cy.visit('/with-subnames.eth')
    connectFromExisting()
    cy.findByTestId('subnames-tab').click()
    cy.findByTestId('name-item-xyz.with-subnames.eth').click()
    cy.wait(500)

    cy.get('button').contains('Delete subname').click()

    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.findByTestId('profile-actions').should('not.exist')
    cy.go('back')

    cy.findByTestId('name-item-xyz.with-subnames.eth').should('not.exist')
  })
})
