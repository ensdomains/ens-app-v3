/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Locator, Page, expect } from '@playwright/test'

import coinsWithIcons from '../../src/constants/coinsWithIcons.json'
import { supportedGeneralRecordKeys } from '../../src/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '../../src/constants/supportedSocialRecordKeys'

type SupportedSocialRecordsKeys = (typeof supportedSocialRecordKeys)[number]

const PROFILE_SNIPPET_KEYS = ['nickname', ...supportedGeneralRecordKeys]
export class ProfilePage {
  readonly page: Page

  readonly getRecreateButton: Locator

  readonly deleteSubnameButton: Locator

  readonly disabledDeleteSubnameButton: Locator

  readonly getExtendButton: Locator

  readonly editProfileButton: Locator

  readonly profileEditor: Locator

  readonly verificationsButton: Locator

  readonly disabledVerificationsButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getRecreateButton = this.page.getByTestId('profile-action-Recreate name')
    this.deleteSubnameButton = this.page.locator('text="Delete subname"')
    this.disabledDeleteSubnameButton = this.page.getByTestId(
      'disabled-profile-action-Delete subname',
    )
    this.getExtendButton = this.page.getByTestId('extend-button')
    this.editProfileButton = this.page.getByTestId('profile-action-Edit profile')
    this.profileEditor = this.page.locator('.modal')
    this.verificationsButton = this.page.getByTestId('profile-action-Verifications')
    this.disabledVerificationsButton = this.page.getByTestId('disabled-profile-action-Verifications')
  }

  async goto(name: string) {
    await this.page.goto(`/${name}`)
  }

  async getExpiryTimestamp() {
    const exipryBtn = this.page.getByTestId('owner-profile-button-name.expiry')
    let count = 0
    while (count < 5) {
      const timestamp = parseInt((await exipryBtn.getAttribute('data-timestamp')) || '')
      if (timestamp) return timestamp
      count += 1
      await this.page.waitForTimeout(100)
    }
    return 0
  }

  record(type: 'text' | 'address' | 'verification', key: string): Locator {
    if (type === 'text' && PROFILE_SNIPPET_KEYS.includes(key))
      return this.page.getByTestId(`profile-snippet-${key}`)
    if (type === 'text' && supportedSocialRecordKeys.includes(key as SupportedSocialRecordsKeys))
      return this.page.getByTestId(`social-profile-button-${key}`)
    if (type === 'text') return this.page.getByTestId(`other-profile-button-${key}`)
    if (type === 'address' && coinsWithIcons.includes(key.toLowerCase()))
      return this.page.getByTestId(`address-profile-button-${key.toLowerCase()}`)
    if (type === 'address') return this.page.getByTestId(`other-profile-button-${key}`)
    if (type === 'verification') return this.page.getByTestId(`verification-profile-button-${key}`)
    return this.page.getByTestId(`other-profile-button-${key}`)
  }

  isRecordVerified(type: 'text' | 'verification', key: string, verified = true) {
    const count = verified ? 1 : 0
    const testId = type === 'text' ? 'verification-badge-record-icon' : 'verification-badge-person-icon'
    return expect(this.record(type, key).locator('../..').getByTestId(testId)).toHaveCount(count)
  }

  isPersonhoodVerified(verified = true) {
    const count = verified ? 1 : 0
    return expect(this.page.getByTestId("profile-snippet-person-icon")).toHaveCount(count)
  }

  isPersonhoodErrored(errored = true) {
    const count = errored ? 1 : 0
    return expect(this.page.getByTestId("verification-badge-error-icon")).toHaveCount(count)
  }

  contentHash(): Locator {
    return this.page.getByTestId('other-profile-button-contenthash')
  }

  async profileEditorAddInputs(keys: string[]) {
    await this.page.getByTestId('show-add-profile-records-modal-button').click()
    for (const key of keys) {
      await this.page.getByTestId(`profile-record-option-${key}`).click()
    }
    await this.page.getByTestId('add-profile-records-button').click()
  }

  profileEditorInput(key: string) {
    if (key === 'description')
      return this.page.getByTestId('profile-record-input-description').locator('textarea')
    return this.page.getByTestId(`profile-record-input-input-${key}`)
  }

  profileEditorClearButton(key: string) {
    if (key === 'description')
      return this.page.getByTestId(`profile-record-input-${key}`).getByRole('button')
    return this.page.getByTestId(`profile-record-input-${key}-delete-button`)
  }
}
