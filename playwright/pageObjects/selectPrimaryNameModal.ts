/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SelectPrimaryNameModal {
  readonly page: Page

  readonly searchInput: Locator

  readonly nextButton: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = this.page.getByTestId('name-table-header-search')
    this.nextButton = this.page.getByTestId('primary-next')
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('load', { timeout: 15000 })
  }

  async getPrimaryNameItem(name: string) {
    return this.page.getByTestId(`name-item-${name}.eth`)
  }
}
