/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Locator, Page, expect } from '@playwright/test'

import coinsWithIcons from '../../src/constants/coinsWithIcons.json'
import { supportedGeneralRecordKeys } from '../../src/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '../../src/constants/supportedSocialRecordKeys'

type SupportedSocialRecordsKeys = (typeof supportedSocialRecordKeys)[number]

const PROFILE_SNIPPET_KEYS = ['nickname', ...supportedGeneralRecordKeys]
export class VerificationsModal {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  verificationOption(protocol: 'Dentity') {
    return this.page.getByTestId(`verification-option-${protocol}`)
  }

  async isVerificationOptionAdded(protocol: 'Dentity', value = true) {
    const count = value ? 1 : 0
    return expect(this.verificationOption(protocol).getByTestId('')).toHaveCount(count)
  }

  removeVerificationOption(protocol: 'Dentity') {
    return this.page.getByTestId(`remove-verification-option-${protocol}`)
  }
 
}
