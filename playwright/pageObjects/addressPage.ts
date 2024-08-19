/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class AddressPage {
  readonly page: Page

  readonly searchInput: Locator

  readonly selectToggle: Locator

  readonly extendNamesButton: Locator

  readonly extendNamesModal: Locator

  readonly extendNamesModalNextButton: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = this.page.getByTestId('name-table-header-search')
    this.selectToggle = this.page.getByTestId('check-button')
    this.extendNamesButton = this.page.getByTestId('extend-names-button')
    this.extendNamesModal = this.page.locator('.modal')
    this.extendNamesModalNextButton = this.extendNamesModal.getByRole('button', { name: 'Next' })
  }

  async goto(addresss: string) {
    await this.page.goto(`/${addresss}`)
  }

  getNameRow(name: string) {
    return this.page.getByTestId(`name-item-${name}`)
  }

  getNameAvatarWrapper(name: string) {
    return this.page.getByTestId(`name-item-avatar-wrapper-${name}`)
  }

  getNameRows(names: string[]) {
    return names.map(this.getNameRow.bind(this))
  }

  nameExpiry(name: string) {
    return this.getNameRow(name).getByTestId('short-expiry')
  }

  async getTimestamp(name: string) {
    const attribute = await this.getNameRow(name)
      .getByTestId('short-expiry')
      .getAttribute('data-timestamp')
    return parseInt(attribute!)
  }

  async getTimestamps(names: string[]) {
    return Promise.all(names.map(this.getTimestamp.bind(this)))
  }

  async search(query = '') {
    return this.searchInput.fill(query)
  }
}
