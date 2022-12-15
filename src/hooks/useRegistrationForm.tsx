import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  profileRecordsToRegistrationForm,
  registrationFormToProfileRecords,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord, ProfileRecordType } from '@app/constants/profileRecordOptions'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import { AvatarEditorType } from '@app/types'
import { validateCryptoAddress } from '@app/utils/validate'
import { validateContentHash } from '@app/validators/validateContentHash'

import { ContentHashProvider } from '../utils/contenthash'

const SINGLE_VALUE_RECORD_TYPES = ['contenthash']

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
    defaultValues: profileRecordsToRegistrationForm(existingRecords),
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
    return ''
  }

  const secondaryLabelForRecord = (record: ProfileRecord) => {
    if (record.group === 'website') return 'contenthash'
    if (record.key === 'contentHash') return 'contenthash'
    if (record.group !== 'custom') return record.key
    return ''
  }

  const placeholderForRecord = (record: ProfileRecord) => {
    if (record.group === 'general')
      return t(`steps.profile.options.groups.general.placeholder.${record.key}`)
    if (record.group === 'social')
      return t(`steps.profile.options.groups.social.placeholder.${record.key}`)
    if (record.group === 'address')
      return supportedAddresses.includes(record.key.toLowerCase())
        ? t(`steps.profile.options.groups.address.placeholder.${record.key}`)
        : t(`steps.profile.options.groups.address.placeholder.default`)
    if (record.group === 'website')
      return t(`steps.profile.options.groups.website.placeholder.${record.key}`)
    return t('steps.profile.options.groups.default.placeholder')
  }

  const validatorForRecord = (record: ProfileRecord) => {
    if (record.key === 'contentHash') return validateContentHash('all')
    if (record.group === 'address') return validateCryptoAddress(record.key)
    if (record.group === 'website') return validateContentHash(record.key as ContentHashProvider)
    if (record.group === 'custom')
      return (key?: string) => {
        if (!key) return t('steps.profile.errors.keyRequired') as string
        const trimmedKey = key.trim()
        if (trimmedKey === 'avatar') {
          const avatar = getValues('avatar')
          if (avatar) return t('steps.profile.errors.avatarReserved') as string
        }
        const allTextRecords = getValues('records').filter((r) => r.type === 'text')
        if (
          allTextRecords.filter((r) => !!r.key && !!trimmedKey && r.key.trim() === trimmedKey)
            .length > 1
        )
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

  const removeRecordByTypeAndKey = (type: ProfileRecordType, key: string) => {
    const index = getValues('records').findIndex((r) => r.type === type && r.key === key)
    if (index >= 0) removeRecordAtIndex(index)
  }

  const addRecords = (recordOrRecords: ProfileRecord | ProfileRecord[]) => {
    const recordsArray = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords]
    recordsArray.forEach((record) => {
      const { key, type } = record
      if (record.group === 'custom') addRecord(record)
      if (SINGLE_VALUE_RECORD_TYPES.includes(type)) {
        const hasType = getValues('records').some((r) => r.type === type)
        if (hasType) return
      } else {
        const hasRecord = getValues('records').some((r) => r.key === key && r.type === type)
        if (hasRecord) return
      }
      addRecord({ ...record, value: record.value || '' })
    })
  }

  const getRecords = () => {
    const avatar = getValues('avatar')
    const _records = getValues('records')
    return registrationFormToProfileRecords({ avatar, records: _records })
  }

  const setAvatar = (avatar?: string) =>
    setValue('avatar', avatar, { shouldDirty: true, shouldTouch: true })

  const getAvatar = () => getValues('avatar')

  return {
    records,
    register,
    trigger,
    control,
    handleSubmit,
    getValues,
    addRecords,
    getRecords,
    removeRecordAtIndex,
    removeRecordByTypeAndKey,
    setAvatar,
    getAvatar,
    labelForRecord,
    secondaryLabelForRecord,
    placeholderForRecord,
    validatorForRecord,
    errorForRecordAtIndex,
    isDirtyForRecordAtIndex,
    hasErrors,
  }
}
