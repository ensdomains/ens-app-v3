/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'
import { Web3ProviderBackend, Web3RequestKind } from 'headless-web3-provider'

export class TransactionModal {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly getIntroButton: Locator

  readonly getConfirmButton: Locator

  readonly getCompleteButton: Locator

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.getIntroButton = this.page.getByTestId('transaction-dialog-intro-trailing-btn')
    this.getConfirmButton = this.page.getByTestId('transaction-modal-confirm-button')
    this.getCompleteButton = this.page.getByTestId('transaction-modal-complete-button')
  }

  async confirm() {
    await this.getConfirmButton.click()
    await this.wallet.authorize(Web3RequestKind.SendTransaction)
  }

  async complete() {
    console.log(await this.getCompleteButton.textContent())
    await this.getCompleteButton.click()
  }

  async autoComplete() {
    if (await this.getIntroButton.count()) {
      await this.getIntroButton.click()
    }

    let hasTransactions = true
    do {
      do {
        // eslint-disable-next-line no-await-in-loop
        await this.confirm()
        // eslint-disable-next-line no-await-in-loop
      } while (await this.getConfirmButton.count())
      // eslint-disable-next-line no-await-in-loop

      const text = await this.getCompleteButton.innerText()
      hasTransactions = text !== 'Done'
      await this.complete()
      // eslint-disable-next-line no-await-in-loop
    } while (hasTransactions)
  }
}
