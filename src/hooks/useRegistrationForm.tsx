import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { AvatarEditorType } from '@app/types'
import { validateCryptoAddress } from '@app/utils/validate'
import { validateContentHash } from '@app/validators/validateContentHash'

import { ContentHashProtocol } from '../utils/contenthash'

export type RegistrationForm = {
  records: ProfileRecord[]
} & AvatarEditorType

export const useRegistrationForm = (existingRecords: ProfileRecord[]) => {
  const { t } = useTranslation('register')

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    getFieldState,
    formState,
    trigger,
  } = useForm<RegistrationForm>({
    mode: 'onChange',
    defaultValues: {
      avatar: existingRecords.find((r) => r.key === 'avatar')?.value,
      records: existingRecords.filter((r) => r.key !== 'avatar'),
    },
  })

  const labelForRecord = (record: ProfileRecord) => {
    if (record.group === 'general')
      return t(`steps.profile.options.groups.general.items.${record.key}`)
    if (record.group === 'social')
      return t(`steps.profile.options.groups.social.items.${record.key}`)
    if (record.group === 'address')
      return t('steps.profile.options.groups.address.itemLabel', { coin: record.key })
    if (record.group === 'other') return t(`steps.profile.options.groups.other.items.${record.key}`)
    if (record.group === 'website')
      return t(`steps.profile.options.groups.website.items.${record.key}`)
  }

  const secondaryLabelForRecord = (record: ProfileRecord) => {
    if (record.group === 'website') return 'contenthash'
    if (record.key === 'contentHash') return 'contenthash'
    if (record.group !== 'custom') return record.key
    return 'uh oh'
  }

  const validatorForRecord = (record: ProfileRecord) => {
    if (record.group === 'address') return validateCryptoAddress(record.key)
    if (record.group === 'website') return validateContentHash(record.key as ContentHashProtocol)
    if (record.key === 'contentHash') return validateContentHash('all')
    if (record.group === 'custom')
      return (value?: string) => {
        const allRecords = getValues('records')
        if (allRecords.filter((r) => r.key === value).length > 1)
          return t('steps.profile.errors.duplicateRecord') as string
        return true
      }
    return () => true
  }

  const errorForRecordAtIndex = (index: number, keyOrValue: 'value' | 'key' = 'value') => {
    return getFieldState(`records.${index}.${keyOrValue}`, formState)?.error?.message
  }

  const isDirtyForRecordAtIndex = (index: number) => {
    return getFieldState(`records.${index}.value`, formState)?.isDirty
  }

  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const {
    fields: records,
    append: addRecord,
    remove: removeRecordAtIndex,
  } = useFieldArray({
    control,
    name: 'records',
  })

  const removeRecordByKey = (key: string) => {
    const index = getValues('records').findIndex((r) => r.key === key)
    if (index >= 0) removeRecordAtIndex(index)
  }

  const addRecords = (recordOrRecords: ProfileRecord | ProfileRecord[]) => {
    const _records = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]
    _records.forEach((record) => {
      if (record.group === 'custom') addRecord(record)
      else if (getValues('records').findIndex((r) => r.key !== record.key) !== -1) addRecord(record)
    })
  }

  const setAvatar = (avatar?: string) =>
    setValue('avatar', avatar, { shouldDirty: true, shouldTouch: true })

  return {
    records,
    register,
    trigger,
    control,
    handleSubmit,
    addRecords,
    removeRecordAtIndex,
    removeRecordByKey,
    setAvatar,
    labelForRecord,
    secondaryLabelForRecord,
    validatorForRecord,
    errorForRecordAtIndex,
    isDirtyForRecordAtIndex,
    hasErrors,
  }
}
