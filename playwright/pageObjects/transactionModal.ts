/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

import { Web3ProviderBackend, Web3RequestKind } from '@ensdomains/headless-web3-provider'

export class TransactionModal {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly introButton: Locator

  readonly confirmButton: Locator

  readonly completeButton: Locator

  readonly closeButton: Locator

  readonly transactionModal: Locator

  readonly backButton: Locator

  readonly stepContainer: Locator

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.introButton = this.page.getByTestId('transaction-dialog-intro-trailing-btn')
    this.confirmButton = this.page.getByTestId('transaction-modal-confirm-button')
    this.completeButton = this.page.getByTestId('transaction-modal-complete-button')
    this.closeButton = this.page.getByTestId('close-icon')
    this.transactionModal = this.page.getByTestId('transaction-modal-inner')
    this.backButton = this.page.locator('body .modal').getByRole('button', { name: 'Back' })
    this.stepContainer = this.page.getByTestId('step-container')
  }

  async authorize() {
    await this.wallet.authorize(Web3RequestKind.SendTransaction)
  }

  async confirm() {
    await this.confirmButton.click({ timeout: 10000 })
    await this.authorize()
  }

  async complete() {
    await this.completeButton.click()
  }

  async getStepCount() {
    const steps = await this.stepContainer
      .locator('div')
      .count()
      // no step container means only 1 step is present, assuming the transaction modal is open and visible
      .catch(() => 1)
    return steps
  }

  async attemptStep() {
    if (await this.introButton.isVisible()) await this.introButton.click()
    if (await this.confirmButton.isVisible()) await this.confirm()
    if (await this.completeButton.isVisible()) await this.complete()
    await this.page.waitForTimeout(500)
  }

  async autoComplete() {
    /* eslint-disable no-await-in-loop */

    let isModalVisible = true
    do {
      await this.attemptStep()
      isModalVisible = await this.transactionModal.isVisible()
    } while (isModalVisible)
    /* eslint-enable no-await-in-loop */
  }

  displayItem(key: string, option = 'normal') {
    return this.page.getByTestId(`display-item-${key}-${option}`).locator('> div').last()
  }
}
