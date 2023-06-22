/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page, expect } from '@playwright/test'
import { Web3ProviderBackend, Web3RequestKind } from 'headless-web3-provider'

import { Accounts } from './accounts'

export class Login {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly getConnectButton: Locator

  readonly getProfileButton: Locator

  constructor(page: Page, wallet: Web3ProviderBackend) {
    this.page = page
    this.wallet = wallet
    this.getConnectButton = this.page.getByTestId('connect-button')
    this.getProfileButton = this.page.getByTestId('header-profile')
  }

  async connect() {
    await this.getConnectButton.click()
    await this.page.locator('text=Browser Wallet').click()
    await this.page.isVisible('text=Confirm connection in the extension')
    expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(1)
    await this.wallet.authorize(Web3RequestKind.RequestAccounts)
    expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(0)
    await this.page.isVisible('text=0xf39...92266')
  }
}
