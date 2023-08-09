/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class ExtendNamesModal {
  readonly page: Page

  readonly getInvoiceExtensionFee: Locator

  readonly getInvoiceTransactionFee: Locator

  readonly getInvoiceTotal

  readonly getCounterMinusButton: Locator

  readonly getCounterPlusButton: Locator

  readonly getCurrencyToggle: Locator

  readonly getExtendButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getInvoiceExtensionFee = this.page.getByTestId('invoice-item-0-amount')
    this.getInvoiceTransactionFee = this.page.getByTestId('invoice-item-1-amount')
    this.getInvoiceTotal = this.page.getByTestId('invoice-total')
    this.getCounterMinusButton = this.page.getByTestId('plus-minus-control-minus')
    this.getCounterPlusButton = this.page.getByTestId('plus-minus-control-plus')
    this.getCurrencyToggle = this.page.getByTestId('extend-names-currency-toggle')
    this.getExtendButton = this.page.getByTestId('extend-names-confirm')
  }
}
