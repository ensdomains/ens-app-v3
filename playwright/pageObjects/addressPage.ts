/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

export class AddressPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(addresss: string) {
    await this.page.goto(`/${addresss}`)
  }

  getNameRow(name: string) {
    return this.page.getByTestId(`name-item-${name}`)
  }

  getNameRows(names: string[]) {
    return names.map(this.getNameRow.bind(this))
  }

  async getTimestamp(name: string) {
    return this.getNameRow(name).getByTestId('short-expiry').getAttribute('data-timestamp')
  }

  async getTimestamps(names: string[]) {
    return Promise.all(names.map(this.getTimestamp.bind(this)))
  }
}
