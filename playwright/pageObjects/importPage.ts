/* eslint-disable import/no-extraneous-dependencies */
import { expect, Locator, Page } from '@playwright/test'

export class ImportPage {
  readonly page: Page

  readonly nextButton: Locator

  readonly onchainRadio: Locator

  readonly offchainRadio: Locator

  readonly heading: Locator

  readonly cost: Locator

  constructor(page: Page) {
    this.page = page
    this.nextButton = this.page.getByTestId('import-next-button')
    this.onchainRadio = this.page.getByTestId('onchain-radio')
    this.offchainRadio = this.page.getByTestId('offchain-radio')
    this.heading = this.page.getByTestId('import-heading')
    this.cost = this.page.getByTestId('import-cost')
  }

  async getCost() {
    await expect(this.cost).not.toBeEmpty()
    await expect(this.cost).not.toHaveText('0.0000 ETH')
    const text = (await this.cost.textContent()) as string
    return parseFloat(text)
  }
}
