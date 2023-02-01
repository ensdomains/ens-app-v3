import { ComponentProps } from 'react'

import { Select } from '@ensdomains/thorin'

import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import textRecords from '@app/constants/textRecords.json'
import { formSafeKey } from '@app/utils/editor'

const excludedKeys = ['avatar', 'banner']

const otherOptions = textRecords
  .filter(
    (record) =>
      !supportedTexts.includes(record) &&
      !supportedProfileItems.includes(record) &&
      !excludedKeys.includes(record),
  )
  .map((key) => ({
    label: key,
    value: formSafeKey(key),
  })) as ComponentProps<typeof Select>['options']

export default otherOptions
