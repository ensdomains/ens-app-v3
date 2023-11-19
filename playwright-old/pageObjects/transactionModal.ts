/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'
import { Web3ProviderBackend, Web3RequestKind } from 'headless-web3-provider'

export class TransactionModal {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly introButton: Locator

  readonly confirmButton: Locator

  readonly completeButton: Locator

  readonly closeButton: Locator

  readonly transactionModal: Locator

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.introButton = this.page.getByTestId('transaction-dialog-intro-trailing-btn')
    this.confirmButton = this.page.getByTestId('transaction-modal-confirm-button')
    this.completeButton = this.page.getByTestId('transaction-modal-complete-button')
    this.closeButton = this.page.getByTestId('close-icon')
    this.transactionModal = this.page.getByTestId('transaction-modal-inner')
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

  async autoComplete() {
    /* eslint-disable no-await-in-loop */

    let isModalVisible = true
    do {
      if (await this.introButton.isVisible()) await this.introButton.click()
      if (await this.confirmButton.isVisible()) await this.confirm()
      if (await this.completeButton.isVisible()) await this.complete()
      await this.page.waitForTimeout(500)
      isModalVisible = await this.transactionModal.isVisible()
    } while (isModalVisible)
    /* eslint-enable no-await-in-loop */
  }
}
