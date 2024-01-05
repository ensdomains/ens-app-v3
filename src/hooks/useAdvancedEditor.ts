import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { P, Pattern, match } from 'ts-pattern'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { textOptions } from '@app/components/@molecules/AdvancedEditor/textOptions'
import addressOptions from '@app/components/@molecules/ProfileEditor/options/addressOptions'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { DetailedProfile } from '@app/hooks/useNameDetails'
import { useProfile } from '@app/hooks/useProfile'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import {
  convertFormSafeKey,
  convertProfileToProfileFormObject,
  formSafeKey,
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

type NormalizedAbi = { contentType: number | undefined; data: string }
export const normalizeAbi = (abi: RecordOptions['abi'] | string): NormalizedAbi | undefined => {
  return match(abi)
    .with(P.string, (data) => ({ contentType: 1, data }))
    .with({ data: P.string }, ({ data }) => ({ contentType: 1, data }))
    .with({ data: {} }, ({ data }) => ({ contentType: 1, data: JSON.stringify(data) }))
    .otherwise(() => undefined)
}

export type AdvancedEditorType = {
  text: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    contentHash?: string
    abi?: {
      data: string
      contentType: number | undefined
    }
  }
}

type TabType = 'text' | 'address' | 'other'

type ExpandableRecordsGroup = 'text' | 'address'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  profile?: DetailedProfile
  loading: ReturnType<typeof useProfile>['loading']
  overwrites?: RecordOptions
  callback: (data: RecordOptions) => void
}

const useAdvancedEditor = ({ profile, loading, overwrites, callback }: Props) => {
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
    control,
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

  const [shouldRunOverwritesScript, setShouldRunOverwritesScript] = useState(false)
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
          abi: formObject.abi,
        },
      }
      reset(newDefaultValues)
      const newExistingRecords: ExpandableRecordsState = {
        address: Object.keys(newDefaultValues.address) || [],
        text: Object.keys(newDefaultValues.text) || [],
      }
      setExistingRecords(newExistingRecords)
      setShouldRunOverwritesScript(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  useEffect(() => {
    if (shouldRunOverwritesScript) {
      overwrites?.texts?.forEach((text) => {
        const { key, value } = text
        const formKey = formSafeKey(key)
        const isExisting = existingRecords.text.includes(formKey)
        if (value && isExisting) {
          setValue(`text.${formKey}`, value, { shouldDirty: true })
        } else if (value && !isExisting) {
          addTextKey(formKey)
          setValue(`text.${formKey}`, value, { shouldDirty: true })
        } else if (!value && isExisting) {
          removeTextKey(formKey, false)
        } else if (!value && !isExisting) {
          removeTextKey(formKey, true)
        }
      })

      overwrites?.coinTypes?.forEach((coinType) => {
        const { key, value } = coinType
        const formKey = formSafeKey(key)
        const isExisting = existingRecords.address.includes(formKey)
        if (value && isExisting) {
          setValue(`address.${formKey}`, value, { shouldDirty: true })
        } else if (value && !isExisting) {
          addAddressKey(formKey)
          setValue(`address.${formKey}`, value, { shouldDirty: true })
        } else if (!value && isExisting) {
          removeAddressKey(formKey, false)
        } else if (!value && !isExisting) {
          removeAddressKey(formKey, true)
        }
      })

      if (typeof overwrites?.contentHash === 'string') {
        setValue('other.contentHash', overwrites.contentHash, { shouldDirty: true })
      }

      const abi = normalizeAbi(overwrites?.abi)
      if (abi) {
        setValue('other.abi', abi, { shouldDirty: true })
      }

      setShouldRunOverwritesScript(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecords, shouldRunOverwritesScript])

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

    const abi = match(dirtyFields.other?.abi?.data)
      .with('', () => ({ data: '' }))
      .with(Pattern.string, (data) => ({ data, contentType: 1 }))
      .otherwise(() => undefined)

    const records = {
      texts,
      coinTypes,
      contentHash,
      abi,
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
    control,
  }
}

export default useAdvancedEditor
