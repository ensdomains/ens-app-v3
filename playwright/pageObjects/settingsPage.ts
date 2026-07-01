/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SettingsPage {
  readonly page: Page

  readonly changePrimaryNameButton: Locator

  readonly removePrimaryNameButton: Locator

  readonly choosePrimaryNameButton: Locator

  readonly walletAddress: Locator

  readonly rpcSection: Locator

  readonly rpcUrlInput: Locator

  readonly rpcExclusiveToggle: Locator

  readonly rpcExclusiveWarning: Locator

  readonly rpcSaveButton: Locator

  readonly rpcResetButton: Locator

  readonly rpcReloadButton: Locator

  constructor(page: Page) {
    this.page = page
    this.changePrimaryNameButton = this.page.getByTestId('change-primary-name-button')
    this.removePrimaryNameButton = this.page.getByTestId('remove-primary-name-button')
    this.choosePrimaryNameButton = this.page.getByTestId('set-primary-name-button')
    this.walletAddress = this.page.getByTestId('name-details-address-address')
    this.rpcSection = this.page.getByTestId('rpc-section')
    this.rpcUrlInput = this.page.getByTestId('rpc-url-input')
    this.rpcExclusiveToggle = this.page.getByTestId('rpc-exclusive-toggle')
    this.rpcExclusiveWarning = this.page.getByTestId('rpc-exclusive-warning')
    this.rpcSaveButton = this.page.getByTestId('rpc-save-button')
    this.rpcResetButton = this.page.getByTestId('rpc-reset-button')
    this.rpcReloadButton = this.page.getByTestId('rpc-reload-button')
  }

  async goto() {
    await this.page.goto(`/my/settings`)
  }

  getPrimaryNameLabel() {
    return this.page.getByTestId(`primary-name-label`)
  }
}
