/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

import { Role } from '@app/hooks/ownership/useRoles/useRoles'

export class OwnershipPage {
  readonly page: Page

  readonly editRolesButton: Locator

  readonly sendNameButton: Locator

  readonly sendDNSButton: Locator

  readonly refreshDNSButton: Locator

  readonly extendButton: Locator

  readonly syncManagerButton: Locator

  constructor(page: Page) {
    this.page = page
    this.editRolesButton = this.page.getByTestId('role-action-edit-roles')
    this.sendNameButton = this.page.getByTestId('role-action-send-name')
    this.sendDNSButton = this.page.getByTestId('role-action-send-dns')
    this.syncManagerButton = this.page.getByTestId('role-action-sync-manager')
    this.refreshDNSButton = this.page.getByTestId('role-action-refresh-dns')
    this.extendButton = this.page.getByTestId('expiry-action-extend')
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
    console.log('>>>>', timestamp)
    const parsed = parseInt(timestamp || '')
    return parsed
  }
}
