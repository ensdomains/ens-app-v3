/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Locator, Page } from '@playwright/test'

export class MyNamesPage {
  readonly page: Page

  readonly searchField: Locator

  constructor(page: Page) {
    this.page = page
    this.searchField = this.page.getByTestId('name-table-header-search')
  }

  async goto() {
    await this.page.goto(`/my/names`)
  }

  async scrollToEnd() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  }

}
