/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class MorePage {
  readonly page: Page

  readonly getSendNameButton: Locator

  readonly getDisabledSendNameButton: Locator

  readonly getEditResolverButton: Locator

  readonly getDisabledEditResolverButton: Locator

  readonly resolver: Locator

  constructor(page: Page) {
    this.page = page
    this.getSendNameButton = this.page.getByTestId('send-name-button')
    this.getDisabledSendNameButton = this.page.getByTestId('send-name-disabled-button')
    this.getEditResolverButton = this.page.getByTestId('edit-resolver-button')
    this.getDisabledEditResolverButton = this.page.getByTestId('set-resolver-disabled-button')
    this.resolver = this.page.getByTestId('name-details-text')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=more`)
  }
}
