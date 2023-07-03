/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class ProfilePage {
  readonly page: Page

  readonly getRecreateButton: Locator

  readonly getDeleteSubnameButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getRecreateButton = this.page.getByTestId('profile-action-Recreate name')
    this.getDeleteSubnameButton = this.page.locator('text="Delete subname"')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}`)
  }
}
