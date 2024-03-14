import { ComponentProps } from 'react'

import { Select } from '@ensdomains/thorin'

import { supportedGeneralRecordKeys } from '@app/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '@app/constants/supportedSocialRecordKeys'
import { textRecords } from '@app/constants/textRecords'
import { formSafeKey } from '@app/utils/editor'

const excludedKeys = ['avatar', 'banner']

const otherOptions = textRecords
  .filter(
    (record) =>
      !supportedGeneralRecordKeys.includes(record as (typeof supportedGeneralRecordKeys)[number]) &&
      !supportedSocialRecordKeys.includes(record as (typeof supportedSocialRecordKeys)[number]) &&
      !excludedKeys.includes(record),
  )
  .map((key) => ({
    label: key,
    value: formSafeKey(key),
  })) as ComponentProps<typeof Select>['options']

export default otherOptions
