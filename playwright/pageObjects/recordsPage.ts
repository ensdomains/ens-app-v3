/* eslint-disable import/no-extraneous-dependencies */
import { Locator, Page } from '@playwright/test'

export class RecordsPage {
  readonly page: Page

  readonly editRecordsButton: Locator

  constructor(page: Page) {
    this.page = page
    this.editRecordsButton = this.page.getByRole('button', { name: 'Edit records' })
  }

  async goto(name: string) {
    await this.page.goto(`/${name}?tab=records`)
  }

  getRecordButton(type: 'text' | 'address' | 'contentHash' | 'abi', key?: string) {
    const testId = key ? `name-details-${type}-${key.toLowerCase()}` : `name-details-${type}`
    return this.page.getByTestId(testId)
  }

  getRecordValue(type: 'text' | 'address' | 'contentHash' | 'abi', key?: string) {
    return this.getRecordButton(type, key).locator('> div').last()
  }
}
