/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SettingsPage {
  readonly page: Page

  readonly changePrimaryNameButton: Locator

  readonly removePrimaryNameButton: Locator

  readonly choosePrimaryNameButton: Locator

  readonly walletAddress: Locator

  constructor(page: Page) {
    this.page = page
    this.changePrimaryNameButton = this.page.getByTestId('change-primary-name-button')
    this.removePrimaryNameButton = this.page.getByTestId('remove-primary-name-button')
    this.choosePrimaryNameButton = this.page.getByTestId('set-primary-name-button')
    this.walletAddress = this.page.getByTestId('name-details-address-address')
  }

  async goto() {
    await this.page.goto(`/my/settings`)
  }

  getPrimaryNameLabel() {
    return this.page.getByTestId(`primary-name-label`)
  }
}
