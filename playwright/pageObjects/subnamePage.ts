/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class SubnamesPage {
  readonly page: Page

  readonly getAddSubnameButton: Locator
  readonly getDisabledAddSubnameButton: Locator
  readonly getAddSubnameInput: Locator
  readonly getSubmitSubnameButton: Locator
  readonly getSubmitSubnameProfileButton: Locator
  readonly addMoreToProfileButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getAddSubnameButton = this.page.getByTestId('add-subname-action')
    this.getDisabledAddSubnameButton = this.page.getByTestId('add-subname-disabled-button')
    this.getAddSubnameInput = this.page.getByTestId('add-subname-input')
    this.getSubmitSubnameButton = this.page.getByTestId('create-subname-next')
    this.getSubmitSubnameProfileButton = this.page.getByTestId('create-subname-profile-next')
    this.addMoreToProfileButton = this.page.getByTestId('show-add-profile-records-modal-button')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=subnames`)
  }

  getSubnameRow(name: string) {
    return this.page.getByTestId(`name-item-${name}`)
  }
}
