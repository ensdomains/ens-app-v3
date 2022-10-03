import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { textOptions } from '@app/components/@molecules/AdvancedEditor/textOptions'
import addressOptions from '@app/components/@molecules/ProfileEditor/options/addressOptions'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { useProfile } from '@app/hooks/useProfile'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import {
  convertFormSafeKey,
  convertProfileToProfileFormObject,
  getDirtyFields,
} from '@app/utils/editor'

const getFieldsByType = (type: 'text' | 'addr' | 'contentHash', data: AdvancedEditorType) => {
  const entries = []
  if (type === 'text' && data.text) {
    entries.push(
      ...Object.entries(data.text).map(([key, value]) => [convertFormSafeKey(key), value]),
    )
  } else if (type === 'addr' && data.address) {
    entries.push(
      ...Object.entries(data.address).map(([key, value]) => [convertFormSafeKey(key), value]),
    )
  } else if (type === 'contentHash' && data.other.contentHash) {
    entries.push(['website', data.other.contentHash])
  }
  return Object.fromEntries(entries)
}

type AdvancedEditorType = {
  text: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    contentHash?: string
    publicKey?: string
    abi?: string
  }
}

type TabType = 'text' | 'address' | 'other'

type ExpandableRecordsGroup = 'text' | 'address'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  profile: ReturnType<typeof useProfile>['profile']
  loading: ReturnType<typeof useProfile>['loading']
  callback: (data: RecordOptions) => void
}

const useAdvancedEditor = ({ profile, loading, callback }: Props) => {
  const { t } = useTranslation('profile')

  const {
    register,
    formState,
    reset,
    setValue,
    getValues,
    getFieldState,
    handleSubmit,
    clearErrors,
    setFocus,
    resetField,
  } = useForm<AdvancedEditorType>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      text: {},
      address: {},
      other: {},
    },
  })

  const [tab, setTab] = useState<TabType>('text')
  const handleTabClick = (_tab: TabType) => () => setTab(_tab)
  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const [existingRecords, setExistingRecords] = useState<ExpandableRecordsState>({
    address: [],
    text: [],
  })

  const {
    existingKeys: existingTextKeys,
    newKeys: newTextKeys,
    addKey: addTextKey,
    removeKey: removeTextKey,
  } = useExpandableRecordsGroup<AdvancedEditorType>({
    group: 'text',
    existingKeys: existingRecords.text,
    options: textOptions,
    setValue,
    getValues,
  })

  const {
    existingKeys: existingAddressKeys,
    newKeys: newAddressKeys,
    addKey: addAddressKey,
    removeKey: removeAddressKey,
    hasOptions: hasAddressOptions,
    availableOptions: availableAddressOptions,
    getSelectedOption: getSelectedAddressOption,
  } = useExpandableRecordsGroup<AdvancedEditorType>({
    group: 'address',
    existingKeys: existingRecords.address,
    options: addressOptions,
    setValue,
    getValues,
  })

  const AddButtonProps = (() => {
    switch (tab) {
      case 'text':
        return {
          createable: true,
          messages: {
            addRecord: t('advancedEditor.tabs.text.addRecord'),
            createRecord: t('advancedEditor.tabs.text.createRecord'),
          },
          onAddRecord: (record: string) => {
            addTextKey(record)
            process.nextTick(() => {
              setFocus(`text.${record}`)
            })
          },
        }
      case 'address':
        if (!hasAddressOptions) return null
        return {
          autocomplete: true,
          inline: true,
          options: availableAddressOptions,
          messages: {
            addRecord: t('advancedEditor.tabs.address.addRecord'),
            noOptions: t('advancedEditor.tabs.address.noOptions'),
          },
          onAddRecord: (key: string) => {
            addAddressKey(key)
            process.nextTick(() => {
              setFocus(`address.${key}`)
            })
          },
        }
      default:
        return null
    }
  })()

  useEffect(() => {
    if (profile) {
      const formObject = convertProfileToProfileFormObject(profile)

      const newDefaultValues = {
        text: {
          ...(formObject.avatar ? { avatar: formObject.avatar } : {}),
          ...(formObject.banner ? { banner: formObject.banner } : {}),
          ...formObject.general,
          ...formObject.accounts,
          ...formObject.other,
        },
        address: formObject.address,
        other: {
          contentHash: formObject.website,
          publicKey: '',
          abi: '',
        },
      }
      reset(newDefaultValues)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(newDefaultValues.address) || [],
        text: Object.keys(newDefaultValues.text) || [],
      }
      setExistingRecords(newExistingRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const { hasInterface: hasABIInterface, isLoading: isLoadingABIInterface } =
    useResolverHasInterfaces(['IABIResolver'], profile?.resolverAddress, loading)

  const { hasInterface: hasPublicKeyInterface, isLoading: isLoadingPublicKeyInterface } =
    useResolverHasInterfaces(['IPubkeyResolver'], profile?.resolverAddress, loading)

  const handleRecordSubmit = async (editorData: AdvancedEditorType) => {
    const dirtyFields = getDirtyFields(formState.dirtyFields, editorData) as AdvancedEditorType

    const texts = Object.entries(getFieldsByType('text', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const coinTypes = Object.entries(getFieldsByType('addr', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const contentHash = dirtyFields.other?.contentHash

    const records = {
      texts,
      coinTypes,
      contentHash,
    }

    callback(records)
  }

  const hasChanges = Object.keys(formState.dirtyFields || {}).length > 0

  return {
    register,
    formState,
    reset,
    setValue,
    getValues,
    getFieldState,
    handleSubmit: handleSubmit(handleRecordSubmit),
    clearErrors,
    setFocus,
    resetField,
    tab,
    setTab,
    handleTabClick,
    hasErrors,
    existingRecords,
    setExistingRecords,
    existingTextKeys,
    newTextKeys,
    addTextKey,
    removeTextKey,
    existingAddressKeys,
    newAddressKeys,
    addAddressKey,
    removeAddressKey,
    hasAddressOptions,
    availableAddressOptions,
    getSelectedAddressOption,
    AddButtonProps,
    hasABIInterface,
    isLoadingABIInterface,
    hasPublicKeyInterface,
    isLoadingPublicKeyInterface,
    hasChanges,
  }
}

export default useAdvancedEditor
