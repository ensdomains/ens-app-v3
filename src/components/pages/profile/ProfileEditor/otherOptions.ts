import textRecords from '@app/constants/textRecords.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import { Select } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import { formSafeKey } from './utils'

const otherOptions = textRecords
  .filter(
    (record) =>
      !supportedTexts.includes(record) &&
      !supportedProfileItems.includes(record),
  )
  .map((key) => ({
    label: key,
    value: formSafeKey(key),
  })) as ComponentProps<typeof Select>['options']

export default otherOptions
