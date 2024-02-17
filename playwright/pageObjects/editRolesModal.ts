/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

import type { Role } from '@app/hooks/ownership/useRoles/useRoles'

export class EditRolesModal {
  readonly page: Page

  readonly searchInput: Locator

  readonly setToSelfButton: Locator

  readonly saveButton: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = this.page.getByTestId('edit-roles-search-input')
    this.setToSelfButton = this.page.getByTestId('edit-roles-set-to-self-button')
    this.saveButton = this.page.getByTestId('edit-roles-save-button')
  }

  roleCard(role: Role) {
    return this.page.getByTestId(`role-card-${role}`)
  }

  roleCardChangeButton(role: Role) {
    return this.roleCard(role).getByTestId('role-card-change-button')
  }

  searchResult(address: string) {
    return this.page.getByTestId(`search-result-${address}`)
  }
}
