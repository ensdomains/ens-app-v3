/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

type GoToOptions = Parameters<Page['goto']>[1]

export class HomePage {
  readonly page: Page

  readonly searchInput: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = this.page.getByTestId('search-input-box')
  }

  async goto(options?: GoToOptions) {
    await this.page.goto('/', options)
  }
}
