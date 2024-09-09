/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class MorePage {
  readonly page: Page

  readonly getSendNameButton: Locator

  readonly getDisabledSendNameButton: Locator

  readonly editResolverButton: Locator

  readonly disabledEditResolverButton: Locator

  readonly sendButton: Locator

  readonly resolver: Locator

  readonly wrapButton: Locator

  readonly unwrapButton: Locator

  readonly pccStatus: Locator

  readonly nameWrapperStatus: Locator

  readonly unwrapButtonDisabled: Locator

  readonly nameWrapperLockIcon: Locator

  readonly nameWrapperCheckIcon: Locator

  readonly npcIcon: Locator

  readonly pccIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.getSendNameButton = this.page.getByTestId('send-name-button')
    this.getDisabledSendNameButton = this.page.getByTestId('send-name-disabled-button')
    this.editResolverButton = this.page.getByTestId('edit-resolver-button')
    this.disabledEditResolverButton = this.page.getByTestId('set-resolver-disabled-button')
    this.sendButton = this.page.getByTestId('send-name-button')
    this.resolver = this.page.getByTestId('name-details-text')
    this.wrapButton = this.page.getByTestId('wrap-name-btn')
    this.unwrapButton = this.page.getByTestId('unwrap-name-btn')
    this.pccStatus = this.page.getByTestId('pcc-status')
    this.nameWrapperStatus = this.page.getByTestId('namewrapper-status')
    this.unwrapButtonDisabled = this.page.getByTestId('cannot-unwrap-disabled-button')
    this.nameWrapperLockIcon = this.page.getByTestId('namewrapper-lock-icon')
    this.nameWrapperCheckIcon = this.page.getByTestId('namewrapper-check-icon')
    this.npcIcon = this.page.getByTestId('npc-icon')
    this.pccIcon = this.page.getByTestId('pcc-icon')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=more`)
  }
}
