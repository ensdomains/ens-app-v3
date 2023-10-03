/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

import { Role } from '@app/hooks/ownership/useRoles/useRoles'

export class OwnershipPage {
  readonly page: Page

  readonly editRolesButton: Locator

  readonly sendNameButton: Locator

  readonly disabledSendNameButton: Locator

  readonly sendDNSButton: Locator

  readonly refreshDNSButton: Locator

  readonly extendButton: Locator

  readonly syncManagerButton: Locator

  readonly expiryPanelExpiry: Locator

  readonly expiryPanelGracePeriod: Locator

  readonly expiryPanelRegistrationDate: Locator

  readonly expiryPanelParentExpiry: Locator

  readonly expiryPanelParentGracePeriod: Locator

  readonly setReminder: Locator

  constructor(page: Page) {
    this.page = page
    this.editRolesButton = this.page.getByTestId('role-action-edit-roles')
    this.sendNameButton = this.page.getByTestId('role-action-send-name')
    this.disabledSendNameButton = this.page.getByTestId('send-name-disabled-button')
    this.sendDNSButton = this.page.getByTestId('role-action-send-dns')
    this.syncManagerButton = this.page.getByTestId('role-action-sync-manager')
    this.refreshDNSButton = this.page.getByTestId('role-action-refresh-dns')
    this.extendButton = this.page.getByTestId('expiry-action-extend')
    this.expiryPanelExpiry = this.page.getByTestId('expiry-panel-expiry')
    this.expiryPanelGracePeriod = this.page.getByTestId('expiry-panel-grace-period')
    this.expiryPanelRegistrationDate = this.page.getByTestId('expiry-panel-registration')
    this.setReminder = this.page.getByTestId('expiry-action-set-reminder')
    this.expiryPanelParentExpiry = this.page.getByTestId('expiry-panel-parent-expiry')
    this.expiryPanelParentGracePeriod = this.page.getByTestId('expiry-panel-parent-grace-period')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=ownership`)
  }

  roleRow(address: string) {
    return this.page.getByTestId(`role-row-${address}`)
  }

  roleTag(role: Role) {
    return this.page.getByTestId(`role-tag-${role}`)
  }

  async getExpiryTimestamp() {
    const timestamp = await this.page
      .getByTestId('expiry-panel-expiry')
      .getAttribute('data-timestamp')
    const parsed = parseInt(timestamp || '')
    return parsed
  }

  async getGracePeriodEndDate() {
    const dateElement = this.page.locator(
      "//div[@data-testid='expiry-panel-grace-period']/div[contains(@class,'Body')]/div[1]",
    )
    const dateText = await dateElement.innerText()
    return dateText
  }

  async getGracePeriodEndTime() {
    const timeElement = this.page.locator(
      "//div[@data-testid='expiry-panel-grace-period']/div[contains(@class,'Body')]/div[2]",
    )
    const timetext = await timeElement.allInnerTexts()
    return timetext
  }

  async getRegistrationDate() {
    const dateElement = this.page.locator(
      "//div[@data-testid='expiry-panel-registration']/div[contains(@class,'Body')]/div[1]",
    )
    const dateText = dateElement.innerText
    return dateText
  }

  async getRegistrationTime() {
    const timeElement = this.page.locator(
      "//div[@data-testid='expiry-panel-registration']/div[contains(@class,'Body')]/div[2]",
    )
    const timetext = timeElement.innerText
    return timetext
  }

  async getParentExpiryDate() {
    const dateElement = this.page.locator(
      "//div[@data-testid='expiry-panel-parent-expiry']/div[contains(@class,'Body')]/div[1]",
    )
    const dateText = await dateElement.innerText()
    return dateText
  }

  async getParentExpiryTime() {
    const dateElement = this.page.locator(
      "//div[@data-testid='expiry-panel-parent-expiry']/div[contains(@class,'Body')]/div[2]",
    )
    const dateText = await dateElement.innerText()
    return dateText
  }

  async getParentGracePeriodEndDate() {
    const timeElement = this.page.locator(
      "//div[@data-testid='expiry-panel-parent-grace-period']/div[contains(@class,'Body')]/div[1]",
    )
    const timetext = await timeElement.allInnerTexts()
    return timetext
  }

  async getParentGracePeriodEndTime() {
    const timeElement = this.page.locator(
      "//div[@data-testid='expiry-panel-parent-grace-period']/div[contains(@class,'Body')]/div[2]",
    )
    const timetext = await timeElement.allInnerTexts()
    return timetext
  }
}
