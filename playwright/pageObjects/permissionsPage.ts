/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Locator, Page } from '@playwright/test'

import { ChildFuses, ParentFuses } from '@ensdomains/ensjs'

type Permission = ChildFuses['fuse'] | ParentFuses['fuse']

export class PermissionsPage {
  readonly page: Page

  readonly getBurnChildPermissionsButton: Locator

  readonly getBurnExtendExpiryButton: Locator

  readonly getBurnPCCButton: Locator

  readonly getBurnCannotBurnFusesButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getBurnChildPermissionsButton = this.page.getByTestId('button-revoke-permissions')
    this.getBurnExtendExpiryButton = this.page.getByTestId('button-extend-expiry')
    this.getBurnPCCButton = this.page.getByTestId('button-revoke-pcc')
    this.getBurnCannotBurnFusesButton = this.page.getByTestId('button-revoke-change-fuses')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=permissions`)
  }

  async isPermissionBurned(permission: Permission) {
    if (permission === 'PARENT_CANNOT_CONTROL')
      return this.page.getByTestId('parent-cannot-control').isVisible()
    if (permission === 'CAN_EXTEND_EXPIRY')
      return this.page.getByTestId('owner-can-extend-expiry').isVisible()
    if (permission === 'CANNOT_BURN_FUSES')
      return this.page.getByTestId('owner-cannot-change-permissions').isVisible()
    return this.page.getByTestId(`burned-${permission}`).isVisible()
  }

  async arePermissionsBurned(permissions: Permission[]) {
    const results = await Promise.all(permissions.map(this.isPermissionBurned.bind(this)))
    return results.every((result) => !!result)
  }

  async isPermissionUnburned(permission: Permission) {
    if (permission === 'PARENT_CANNOT_CONTROL')
      return this.page.getByTestId('parent-can-control').isVisible()
    if (permission === 'CAN_EXTEND_EXPIRY')
      return this.page.getByTestId('owner-cannot-extend-expiry').isVisible()
    if (permission === 'CANNOT_BURN_FUSES')
      return this.page.getByTestId('owner-can-change-permissions').isVisible()
    return this.page.getByTestId(`unburned-${permission}`).isVisible()
  }

  async arePermissionsUnburned(permissions: Permission[]) {
    const results = await Promise.all(permissions.map(this.isPermissionUnburned.bind(this)))
    return results.every((result) => !!result)
  }

  async burnChildPermissions(childPermissions: ChildFuses['fuse'][]) {
    await this.getBurnChildPermissionsButton.click()

    const nextButton = this.page.getByTestId('permissions-next-button')
    let hasNextButton = (await nextButton.count()) > 0
    while (hasNextButton) {
      for (const permission of childPermissions) {
        const checkbox = this.page.getByTestId(`checkbox-${permission}`)
        if (await checkbox.count()) await checkbox.check()
      }
      await nextButton.click()
      hasNextButton = (await nextButton.count()) > 0
    }
  }

  async burnExtendExpiry() {
    await this.getBurnExtendExpiryButton.click()
    const nextButton = this.page.getByTestId('permissions-next-button')
    let hasNextButton = (await nextButton.count()) > 0
    while (hasNextButton) {
      const checkbox = this.page.getByTestId(`checkbox-CAN_EXTEND_EXPIRY`)
      if (await checkbox.count()) await checkbox.check()
      await nextButton.click()
      hasNextButton = (await nextButton.count()) > 0
    }
  }

  async burnPCC(permissions: Permission[] = []) {
    await this.getBurnPCCButton.click()

    const _permissions = ['pcc', ...permissions]
    const nextButton = this.page.getByTestId('permissions-next-button')
    let hasNextButton = (await nextButton.count()) > 0
    while (hasNextButton) {
      for (const permission of _permissions) {
        const checkbox = this.page.getByTestId(`checkbox-${permission}`)
        if (await checkbox.count()) await checkbox.check()
      }
      await nextButton.click()
      hasNextButton = (await nextButton.count()) > 0
    }
  }

  async burnCannotBurnFuses() {
    await this.getBurnCannotBurnFusesButton.click()

    const nextButton = this.page.getByTestId('permissions-next-button')
    let hasNextButton = (await nextButton.count()) > 0
    while (hasNextButton) {
      const checkbox = this.page.getByTestId(`checkbox-CANNOT_BURN_FUSES`)
      if (await checkbox.count()) await checkbox.check()
      await nextButton.click()
      hasNextButton = (await nextButton.count()) > 0
    }
  }
}
