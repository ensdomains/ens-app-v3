import React, { ComponentProps, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import accountsOptions from '@app/components/@molecules/ProfileEditor/options/accountsOptions'
import addressOptions from '@app/components/@molecules/ProfileEditor/options/addressOptions'
import otherOptions from '@app/components/@molecules/ProfileEditor/options/otherOptions'
import websiteOptions from '@app/components/@molecules/ProfileEditor/options/websiteOptions'
import { RecordInput } from '@app/components/@molecules/RecordInput/RecordInput'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { useProfile } from '@app/hooks/useProfile'
import { ProfileEditorType } from '@app/types'
import { emptyAddress } from '@app/utils/constants'
import {
  convertFormSafeKey,
  convertProfileToProfileFormObject,
  getDirtyFields,
} from '@app/utils/editor'

const getFieldsByType = (type: 'text' | 'addr' | 'contentHash', data: ProfileEditorType) => {
  const entries = []
  if (type === 'text') {
    if (data.avatar) entries.push(['avatar', data.avatar])
    if (data.banner) entries.push(['banner', data.banner])
    if (data.general)
      entries.push(
        ...Object.entries(data.general).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
    if (data.accounts)
      entries.push(
        ...Object.entries(data.accounts).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
    if (data.other)
      entries.push(
        ...Object.entries(data.other).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
  } else if (type === 'addr') {
    if (data.address)
      entries.push(
        ...Object.entries(data.address).map(([key, value]) => [convertFormSafeKey(key), value]),
      )
  } else if (type === 'contentHash') {
    if (data.website) entries.push(['website', data.website])
  }
  return Object.fromEntries(entries)
}

type RecordOption = ComponentProps<typeof RecordInput>['option']

type TabType = 'general' | 'accounts' | 'address' | 'website' | 'other'

type ExpandableRecordsGroup = 'accounts' | 'address' | 'other'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

export type Props = {
  callback: (data: RecordOptions, event?: React.BaseSyntheticEvent) => void
  profile: ReturnType<typeof useProfile>['profile']
  returnAllFields?: boolean
}

const useProfileEditor = ({ callback, profile, returnAllFields }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const {
    register,
    unregister,
    formState,
    reset,
    resetField,
    setValue,
    getValues,
    getFieldState,
    control,
    setFocus,
    handleSubmit,
    clearErrors,
  } = useForm<ProfileEditorType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      general: {},
      accounts: {},
      address: {},
      website: '',
      other: {},
    },
    shouldUnregister: false,
  })

  const [tab, setTab] = useState<TabType>('general')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const [existingRecords, setExistingRecords] = useState<ExpandableRecordsState>({
    address: [],
    other: [],
    accounts: [],
  })

  const {
    existingKeys: existingAccountKeys,
    newKeys: newAccountKeys,
    addKey: addAccountKey,
    removeKey: removeAccountKey,
    hasOptions: hasAccountOptions,
    availableOptions: availableAccountOptions,
    getSelectedOption: getSelectedAccountOption,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'accounts',
    existingKeys: existingRecords.accounts,
    options: accountsOptions,
    setValue,
    getValues,
    returnAllFields,
  })

  const {
    existingKeys: existingAddressKeys,
    newKeys: newAddressKeys,
    addKey: addAddressKey,
    removeKey: removeAddressKey,
    hasOptions: hasAddressOptions,
    availableOptions: availableAddressOptions,
    getSelectedOption: getSelectedAddressOption,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
    returnAllFields,
  })

  const [hasExistingWebsite, setHasExistingWebsite] = useState(false)
  const [websiteOption, setWebsiteOption] = useState<RecordOption | undefined>(undefined)

  const {
    existingKeys: existingOtherKeys,
    newKeys: newOtherKeys,
    addKey: addOtherKey,
    removeKey: removeOtherKey,
  } = useExpandableRecordsGroup<ProfileEditorType>({
    group: 'other',
    existingKeys: existingRecords.other,
    options: otherOptions,
    setValue,
    getValues,
    returnAllFields,
  })

  const AddButtonProps = (() => {
    switch (tab) {
      case 'accounts':
        if (!hasAccountOptions) return null
        return {
          autocomplete: true,
          options: availableAccountOptions,
          messages: {
            addRecord: t('input.profileEditor.tabs.accounts.addAccount'),
            noOptions: t('input.profileEditor.tabs.accounts.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAccountKey(key)
            process.nextTick(() => {
              setFocus(`accounts.${key}`)
            })
          },
        }
      case 'address':
        if (!hasAddressOptions) return null
        return {
          autocomplete: true,
          options: availableAddressOptions,
          messages: {
            addRecord: t('input.profileEditor.tabs.address.addAddress'),
            noOptions: t('input.profileEditor.tabs.address.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAddressKey(key)
            process.nextTick(() => {
              setFocus(`address.${key}`)
            })
          },
        }
      case 'website':
        if (websiteOption) return undefined
        return {
          options: websiteOptions,
          messages: {
            selectOption: t('input.profileEditor.tabs.contentHash.addContentHash'),
          },
          onAddRecord: (key: string) => {
            const option = websiteOptions.find(({ value }) => value === key)
            if (!option) return
            setWebsiteOption(option)
            process.nextTick(() => {
              setFocus('website')
            })
          },
        }
      case 'other':
        return {
          createable: true,
          messages: {
            addRecord: t('input.profileEditor.tabs.other.addRecord'),
            createRecord: t('input.profileEditor.tabs.other.createRecord'),
          },
          onAddRecord: (record: string) => {
            addOtherKey(record)
            process.nextTick(() => {
              setFocus(`other.${record}`)
            })
          },
        }
      default:
        return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })()

  useEffect(() => {
    if (profile) {
      const newDefaultValues = convertProfileToProfileFormObject(profile)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(newDefaultValues.address) || [],
        other: Object.keys(newDefaultValues.other) || [],
        accounts: Object.keys(newDefaultValues.accounts) || [],
      }
      reset(newDefaultValues)
      setExistingRecords(newExistingRecords)

      setHasExistingWebsite(!!newDefaultValues.website)
      const protocol = newDefaultValues.website?.match(/^[^:]+/)?.[0]?.toLowerCase()
      if (protocol) {
        const option = websiteOptions.find(({ value }) => value === protocol)
        setWebsiteOption(option || undefined)
      }
    }
  }, [profile, reset])

  const getValuesAsProfile = (profileData: ProfileEditorType) => {
    const dirtyFields = getDirtyFields(
      formState[returnAllFields ? 'touchedFields' : 'dirtyFields'],
      profileData,
    ) as ProfileEditorType

    const texts = Object.entries(getFieldsByType('text', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const coinTypes = Object.entries(getFieldsByType('addr', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const coinTypesWithZeroAddressses = coinTypes.map((coinType) => {
      if (coinType.value) return coinType
      return { key: coinType.key, value: emptyAddress }
    })

    const contentHash = dirtyFields.website

    return {
      texts,
      coinTypes: coinTypesWithZeroAddressses,
      contentHash,
    }
  }

  const handleProfileSubmit = async (
    profileData: ProfileEditorType,
    event?: React.BaseSyntheticEvent,
  ) => {
    const records = getValuesAsProfile(profileData)

    callback(records, event)
  }

  const avatar = useWatch({
    control,
    name: 'avatar',
  })

  const _avatar = useWatch({
    control,
    name: '_avatar',
  })

  const hasChanges = Object.keys(formState.dirtyFields || {}).length > 0

  return {
    register,
    unregister,
    formState,
    reset,
    resetField,
    setValue,
    getValues,
    getFieldState,
    control,
    setFocus,
    handleSubmit: handleSubmit(handleProfileSubmit),
    getValuesAsProfile,
    clearErrors,
    tab,
    setTab,
    handleTabClick,
    hasErrors,
    existingRecords,
    setExistingRecords,
    existingAccountKeys,
    newAccountKeys,
    addAccountKey,
    removeAccountKey,
    hasAccountOptions,
    availableAccountOptions,
    getSelectedAccountOption,
    existingAddressKeys,
    newAddressKeys,
    addAddressKey,
    removeAddressKey,
    hasAddressOptions,
    availableAddressOptions,
    getSelectedAddressOption,
    hasExistingWebsite,
    setHasExistingWebsite,
    websiteOption,
    setWebsiteOption,
    existingOtherKeys,
    newOtherKeys,
    addOtherKey,
    removeOtherKey,
    AddButtonProps,
    avatar,
    _avatar,
    hasChanges,
  }
}

export default useProfileEditor
