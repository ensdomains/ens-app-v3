/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class AdvancedEditorModal {
  readonly page: Page

  readonly saveButton: Locator

  constructor(page: Page) {
    this.page = page
    this.saveButton = this.page.locator('.modal').getByRole('button', { name: 'Save' })
  }

  tab(tab: 'text' | 'address' | 'other') {
    return this.page.getByTestId(`${tab}-tab`)
  }

  async recordComponent(type: 'text' | 'address' | 'contentHash' | 'abi', key?: string) {
    if (['text', 'address'].includes(type)) {
      await this.tab(type as 'text' | 'other').click()
      return this.page.getByTestId(`record-input-${key}`)
    }
    await this.tab('other').click()
    const _key = type === 'contentHash' ? 'Content Hash' : 'ABI'
    return this.page.getByTestId(`record-input-${_key}`)
  }

  async recordInput(type: 'text' | 'address' | 'contentHash' | 'abi', key?: string) {
    const component = await this.recordComponent(type, key)
    return component.locator('input')
  }

  async recordClearButton(type: 'text' | 'address', key: string) {
    const component = await this.recordComponent(type, key)
    return component.locator('button')
  }
}
