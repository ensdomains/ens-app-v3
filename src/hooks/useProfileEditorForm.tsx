import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  isEthAddressRecord,
  profileEditorFormToProfileRecords,
  profileRecordsToProfileEditorForm,
} from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { ProfileRecord, ProfileRecordGroup } from '@app/constants/profileRecordOptions'
import { supportedAddresses } from '@app/constants/supportedAddresses'
import { AvatarEditorType } from '@app/types'
import { normalizeCoinAddress } from '@app/utils/coin'
import { validateAccount } from '@app/validators/validateAccount'
import { validateCryptoAddress } from '@app/validators/validateAddress'
import { validateContentHash } from '@app/validators/validateContentHash'
import { validateUrl } from '@app/validators/validateUrl'

import { ContentHashProvider } from '../utils/contenthash'
import { validateAbi } from '../validators/validateAbi'

const SINGLE_VALUE_RECORD_TYPES = ['contenthash']

const SUPPORTED_AVUP_ENDPOINTS = [
  'https://euc.li',
  'https://ens.xyz',
  'https://avatar-upload.ens-cf.workers.dev',
]

export type ProfileEditorForm = {
  records: ProfileRecord[]
} & AvatarEditorType

export const isDirtyForRecordAtIndexCalc = (
  index: number,
  defaultRecords: ProfileRecord[],
  currentRecords: ProfileRecord[],
) => {
  const defaultRecord = defaultRecords[index]
  const currentRecord = currentRecords.find((record) => record?.key === defaultRecord?.key)
  if (!currentRecord) return false
  return currentRecord?.value !== defaultRecord.value
}

export const useProfileEditorForm = (existingRecords: ProfileRecord[]) => {
  const { t } = useTranslation('register')

  const defaultValues = profileRecordsToProfileEditorForm(existingRecords)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    getFieldState,
    formState,
    trigger,
  } = useForm<ProfileEditorForm>({
    mode: 'onChange',
    defaultValues,
  })

  const labelForRecord = (record: ProfileRecord) => {
    if (record.group === 'general')
      return t(`steps.profile.options.groups.general.items.${record.key}`)
    if (record.group === 'social')
      return t(`steps.profile.options.groups.social.items.${record.key}`)
    if (record.group === 'address')
      return t('steps.profile.options.groups.address.itemLabel', {
        coin: record.key,
      })
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
      return supportedAddresses.includes(record.key as (typeof supportedAddresses)[number])
        ? t(`steps.profile.options.groups.address.placeholder.${record.key}`)
        : t(`steps.profile.options.groups.address.placeholder.default`)
    if (record.group === 'website')
      return t(`steps.profile.options.groups.website.placeholder.${record.key}`)
    return t('steps.profile.options.groups.default.placeholder')
  }

  const validatorForRecord = (record: ProfileRecord) => {
    if (record.key === 'contentHash') return validateContentHash('all')
    if (record.key === 'url') return validateUrl
    if (record.group === 'address') {
      return (value?: string) => {
        const address_ = normalizeCoinAddress({ coin: record.key, address: value })
        const result = validateCryptoAddress({ coin: record.key, address: address_ })

        if (isEthAddressRecord(record) && !value) {
          return true
        }

        if (typeof result === 'string') {
          if (result === 'addressRequired') return t('errors.addressRequired', { ns: 'common' })
          return t('errors.invalidAddress', { ns: 'common' })
        }
        return result
      }
    }
    if (record.group === 'website') return validateContentHash(record.key as ContentHashProvider)
    if (record.type === 'abi') return validateAbi(t)
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
    if (record.group === 'social')
      return (value?: string) => {
        if (!value) return true
        const isValid = validateAccount({ key: record.key, value })
        if (!isValid) return t('steps.profile.errors.invalidValue') as string
        return true
      }
    return () => true
  }

  const errorForRecordAtIndex = (index: number, keyOrValue: 'value' | 'key' = 'value') => {
    return getFieldState(`records.${index}.${keyOrValue}`, formState)?.error?.message
  }

  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const {
    fields: records,
    append: addRecord,
    remove: removeRecordAtIndex,
    append: appendRecord,
    update: updateRecordAtIndex,
  } = useFieldArray({
    control,
    name: 'records',
  })

  const isDirtyForRecordAtIndex = (index: number) => {
    return isDirtyForRecordAtIndexCalc(index, defaultValues.records, getValues('records'))
  }

  const setAvatar = (avatar?: string) => {
    const existingRecord = existingRecords.find((r) => r.group === 'media' && r.key === 'avatar')
    const avatarIsChanged = !(
      existingRecord &&
      SUPPORTED_AVUP_ENDPOINTS.some((endpoint) => existingRecord.value?.startsWith(endpoint)) &&
      SUPPORTED_AVUP_ENDPOINTS.some((endpoint) => avatar?.startsWith(endpoint))
    )
    if (avatarIsChanged) {
      setValue('avatar', avatar || '', { shouldDirty: true, shouldTouch: true })
    }
  }

  const removeRecordByGroupAndKey = (group: ProfileRecordGroup, key: string) => {
    if (group === 'media' && key === 'avatar') return setAvatar('')
    const index = getValues('records').findIndex((r) => r.group === group && r.key === key)
    if (index >= 0) removeRecordAtIndex(index)
  }

  const updateRecord = (record: ProfileRecord) => {
    const currentRecords: ProfileRecord[] = getValues('records')
    const index = currentRecords.findIndex((r) => r.group === record.group && r.key === record.key)
    if (index >= 0) {
      setValue(`records.${index}`, record, { shouldDirty: true, shouldTouch: true })
    } else {
      appendRecord(record)
    }
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
    return profileEditorFormToProfileRecords({ avatar, records: _records })
  }

  const getAvatar = () => getValues('avatar')

  return {
    isDirty: formState.isDirty,
    records,
    register,
    trigger,
    control,
    handleSubmit,
    getValues,
    addRecords,
    getRecords,
    updateRecord,
    removeRecordAtIndex,
    updateRecordAtIndex,
    removeRecordByGroupAndKey,
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
