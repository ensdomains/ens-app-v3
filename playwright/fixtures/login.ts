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

  async connect(user: User = 'user', isSafeWallet: boolean = false) {
    if (user !== 'user') {
      const pk = this.accounts.getPrivateKey(user)
      await this.wallet.changeAccounts([pk!])
    }
    await this.waitForLoad()

    // Handle Safe banners/modals if this is Safe wallet
    if (isSafeWallet) {
      await this.handleSafeBanners()
    }

    // For Safe wallet, use .first() since there are multiple connect buttons
    if (isSafeWallet) {
      console.log('Connecting to Safe wallet...')
      await this.page.getByTestId('connect-wallet-btn').first().click()
    } else {
      await this.getConnectButton.click()
    }

    // Always select Headless Web3 Provider
    await this.page.getByText('Headless Web3 Provider').click()

    // Different connection flow for Safe vs ENS
    if (isSafeWallet) {
      // For Safe wallet, we don't need the extension confirmation flow
      // Just handle the account requests directly
      await expect
        .poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts))
        .toBeGreaterThanOrEqual(1)
      await this.wallet.authorize(Web3RequestKind.RequestAccounts)
      await expect
        .poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts))
        .toEqual(0)
      // For Safe, we don't check for profile button visibility
    } else {
      // For ENS app, use the full flow with extension confirmation
      await expect(this.page.getByText('Confirm connection in the extension')).toBeVisible({
        timeout: 15000,
      })
      await expect
        .poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestPermissions))
        .toBeGreaterThanOrEqual(1)
      // this isn't actually what the user experiences, just a quirk in headless-web3-provider
      await this.wallet.authorize(Web3RequestKind.RequestPermissions)
      await expect
        .poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts))
        .toBeGreaterThanOrEqual(1)
      await this.wallet.authorize(Web3RequestKind.RequestAccounts)
      await expect
        .poll(() => this.wallet.getPendingRequestCount(Web3RequestKind.RequestAccounts))
        .toEqual(0)
      await expect.poll(() => this.getProfileButton.isVisible()).toBe(true)
    }
  }

  async handleSafeBanners() {
    // Handle various Safe wallet banners and modals
    await this.page.waitForTimeout(2000) // Wait for page to load

    try {
      // Handle cookie banner - "Accept all" button (based on your screenshot)
      const acceptAllButton = this.page.getByText('Accept all')
      if (await acceptAllButton.isVisible({ timeout: 3000 })) {
        await acceptAllButton.click()
        console.log('✅ Clicked Accept all for cookies')
        await this.page.waitForTimeout(1000)
        return // Exit early if we handled the main banner
      }
    } catch (error) {
      // Accept all button not present
    }

    try {
      // Handle cookie banner - "Got it!" button
      const gotItButton = this.page.getByText('Got it!').first()
      if (await gotItButton.isVisible({ timeout: 3000 })) {
        await gotItButton.click()
        console.log('✅ Dismissed cookie banner')
      }
    } catch (error) {
      // Cookie banner not present
    }

    try {
      // Handle cookie settings - "Save settings" button
      const saveSettingsButton = this.page.getByText('Save settings')
      if (await saveSettingsButton.isVisible({ timeout: 3000 })) {
        await saveSettingsButton.click()
        console.log('✅ Saved cookie settings')
      }
    } catch (error) {
      // Save settings not present
    }

    try {
      // Handle outreach popup - close button
      const closeOutreachButton = this.page.locator('button[aria-label="close outreach popup"]')
      if (await closeOutreachButton.isVisible({ timeout: 3000 })) {
        await closeOutreachButton.click()
        console.log('✅ Closed outreach popup')
      }
    } catch (error) {
      // Outreach popup not present
    }

    try {
      // Handle security notice - "I understand" button
      const understandButton = this.page.getByText('I understand')
      if (await understandButton.isVisible({ timeout: 3000 })) {
        await understandButton.click()
        console.log('✅ Dismissed security notice')
      }
    } catch (error) {
      // Security notice not present
    }

    await this.page.waitForTimeout(1000) // Wait for any animations to complete
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
