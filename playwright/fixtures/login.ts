/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page, expect } from '@playwright/test'
import { Web3ProviderBackend, Web3RequestKind } from 'headless-web3-provider'

import { Accounts, User } from './accounts'

export class Login {
  readonly page: Page

  readonly wallet: Web3ProviderBackend

  readonly accounts: Accounts

  readonly getConnectButton: Locator

  readonly getProfileButton: Locator

  constructor(page: Page, wallet: Web3ProviderBackend, accounts: Accounts) {
    this.page = page
    this.wallet = wallet
    this.accounts = accounts
    this.getConnectButton = this.page.getByTestId('connect-button')
    this.getProfileButton = this.page.getByTestId('header-profile')
  }

  async connect(user: User = 'user') {
    if (user !== 'user') {
      const pk = this.accounts.getPrivateKey(user)
      await this.wallet.changeAccounts([pk!])
    }
    await this.getConnectButton.click()
    await this.page.getByText('Browser Wallet').click()
    await expect(this.page.getByText('Confirm connection in the extension')).toBeVisible()
    await expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(1)
    await this.wallet.authorize(Web3RequestKind.RequestAccounts)
    await expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(0)
    await expect(this.getProfileButton).toBeVisible()
  }
}
