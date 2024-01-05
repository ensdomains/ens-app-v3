/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SendNameModal {
  readonly page: Page

  readonly searchInput: Locator

  readonly resetProfileSwitch: Locator

  readonly sendButton: Locator

  readonly confirmButton: Locator

  readonly summaryHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = this.page.getByTestId('send-name-search-input')
    this.resetProfileSwitch = this.page.getByTestId('send-name-reset-profile-switch')
    this.sendButton = this.page.getByTestId('send-name-send-button')
    this.confirmButton = this.page.getByTestId('send-name-confirm-button')
    this.summaryHeader = this.page.getByRole('button', { name: 'Summary of changes' })
  }

  searchResult(address: string) {
    return this.page.getByTestId(`search-result-${address}`)
  }

  summaryItem(type: 'owner' | 'manager' | 'eth-record' | 'reset-profile') {
    return this.page.getByTestId(`send-name-summary-${type}`)
  }
}
