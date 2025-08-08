/* eslint-disable import/no-extraneous-dependencies */
import { expect, Locator, Page } from '@playwright/test'

import { Web3ProviderBackend, Web3RequestKind } from '@ensdomains/headless-web3-provider'

import { Accounts, User } from './accounts.js'

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

  async waitForLoad() {
    /**
     * TEMP FIX
     * A bug in rainbow kit needs time to load the provider. Could be fixed in version 1.0.4
     * Also throws error with walletconnect if not enough time has passed.
     */
  }

  async connect(user: User = 'user') {
    if (user !== 'user') {
      const pk = this.accounts.getPrivateKey(user)
      await this.wallet.changeAccounts([pk!])
    }
    await this.waitForLoad()
    await this.getConnectButton.click()
    await this.page.getByText('Browser Wallet').click()
    await expect(this.page.getByText('Confirm connection in the extension')).toBeVisible({
      timeout: 15000,
    })
    await expect.poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestPermissions)).toBeGreaterThanOrEqual(1)
    // this isn't actually what the user experiences, just a quirk in headless-web3-provider
    await this.wallet.authorize(Web3RequestKind.RequestPermissions)
    await expect.poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toBeGreaterThanOrEqual(1)
    await this.wallet.authorize(Web3RequestKind.RequestAccounts)
    await expect.poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts)).toEqual(0)
    await expect.poll(() => this.getProfileButton.isVisible()).toBe(true)
  }

  async switchTo(user: User) {
    const pk = this.accounts.getPrivateKey(user)
    await this.wallet.changeAccounts([pk!])
  }

  async reconnect() {
    await this.waitForLoad()
    await this.getConnectButton.click()
    await this.page.getByText('Browser Wallet').click()
    await expect(this.page.getByText('Confirm connection in the extension')).toBeVisible({
      timeout: 15000,
    })
    expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestPermissions)).toEqual(1)
    await this.wallet.authorize(Web3RequestKind.RequestPermissions)
    expect(this.wallet.getPendingRequestCount(Web3RequestKind.RequestPermissions)).toEqual(0)
  }
}
