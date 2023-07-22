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

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.introButton = this.page.getByTestId('transaction-dialog-intro-trailing-btn')
    this.confirmButton = this.page.getByTestId('transaction-modal-confirm-button')
    this.completeButton = this.page.getByTestId('transaction-modal-complete-button')
    this.closeButton = this.page.getByTestId('close-icon')
  }

  async authorize() {
    await this.wallet.authorize(Web3RequestKind.SendTransaction)
  }

  async confirm() {
    await this.confirmButton.click()
    await this.authorize()
  }

  async complete() {
    await this.completeButton.click()
  }

  async autoComplete() {
    if (await this.introButton.count()) {
      await this.introButton.click()
    }

    let hasTransactions = true
    do {
      do {
        // eslint-disable-next-line no-await-in-loop
        await this.confirm()
        // eslint-disable-next-line no-await-in-loop
      } while (await this.confirmButton.count())
      // eslint-disable-next-line no-await-in-loop

      const text = await this.completeButton.innerText()
      hasTransactions = text !== 'Done'
      await this.complete()
      // eslint-disable-next-line no-await-in-loop
    } while (hasTransactions)
  }
}
