/* eslint-disable import/no-extraneous-dependencies */
import { expect, Locator, Page } from '@playwright/test'

export class RegistrationPage {
  readonly page: Page

  readonly fee: Locator

  readonly gas: Locator

  readonly primaryNameToggle: Locator

  readonly plusYearButton: Locator

  readonly minusYearButton: Locator

  constructor(page: Page) {
    this.page = page
    this.fee = this.page.getByTestId('invoice-item-0-amount')
    this.gas = this.page.getByTestId('invoice-item-1-amount')
    this.primaryNameToggle = this.page.getByTestId('primary-name-toggle')
    this.plusYearButton = this.page.getByTestId('plus-minus-control-plus')
    this.minusYearButton = this.page.getByTestId('plus-minus-control-minus')
  }

  async getGas() {
    await expect(this.gas).not.toBeEmpty()
    await expect(this.gas).not.toHaveText('0.0000 ETH')
    const text = (await this.gas.textContent()) as string
    return parseFloat(text)
  }

  yearMarker(num: number) {
    return this.page.getByTestId(`year-marker-${num}`)
  }
}
