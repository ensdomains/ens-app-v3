/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'
import { Web3ProviderBackend, Web3RequestKind } from 'headless-web3-provider'

export class TransactionModal {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly getConfirmButton: Locator

  readonly getCompleteButton: Locator

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.getConfirmButton = this.page.getByTestId('transaction-modal-confirm-button')
    this.getCompleteButton = this.page.getByTestId('transaction-modal-complete-button')
  }

  async confirm() {
    await this.getConfirmButton.click()
    await this.wallet.authorize(Web3RequestKind.SendTransaction)
  }

  async complete() {
    await this.getCompleteButton.click()
  }

  async autoComplete() {
    let count = await this.getConfirmButton.count()
    while (count > 0) {
      // eslint-disable-next-line no-await-in-loop
      await this.confirm()
      // eslint-disable-next-line no-await-in-loop
      count = await this.getConfirmButton.count()
    }
    await this.complete()
  }
}
