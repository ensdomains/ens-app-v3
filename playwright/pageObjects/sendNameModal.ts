/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SendNameModal {
  readonly page: Page

  readonly nextButton: Locator

  constructor(page: Page) {
    this.page = page
    this.nextButton = this.page.getByRole('button', { name: 'Next' })
  }

  async clickNextButton() {
    try {
      return await this.nextButton.click()
    } catch {
      await this.page.pause()
    }
  }
}
