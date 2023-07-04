/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Locator, Page } from '@playwright/test'

export class ProfilePage {
  readonly page: Page

  readonly getRecreateButton: Locator

  readonly getDeleteSubnameButton: Locator

  readonly getExtendButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getRecreateButton = this.page.getByTestId('profile-action-Recreate name')
    this.getDeleteSubnameButton = this.page.locator('text="Delete subname"')
    this.getExtendButton = this.page.getByTestId('extend-button')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}`)
  }

  async getExpiryTimestamp() {
    const exipryBtn = this.page.getByTestId('owner-profile-button-name.expiry')
    let count = 0
    while (count < 5) {
      const timestamp = parseInt((await exipryBtn.getAttribute('data-timestamp')) || '')
      if (timestamp) return timestamp
      count += 1
      await this.page.waitForTimeout(100)
    }
    return 0
  }
}
