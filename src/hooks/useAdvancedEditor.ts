import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { hexToString } from 'viem'
import { useClient } from 'wagmi'

import { encodeAbi, EncodedAbi, RecordOptions } from '@ensdomains/ensjs/utils'

import { textOptions } from '@app/components/@molecules/AdvancedEditor/textOptions'
import addressOptions from '@app/components/@molecules/ProfileEditor/options/addressOptions'
import useExpandableRecordsGroup from '@app/hooks/useExpandableRecordsGroup'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { Profile } from '@app/types'
import { getUsedAbiEncodeAs } from '@app/utils/abi'
import { normalizeCoinAddress } from '@app/utils/coin'
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

export type AdvancedEditorType = {
  text: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    contentHash?: string
    abi: {
      data: string
      contentType: EncodedAbi['contentType'] | 0
    }
  }
}

// Note: This function is for converting from Record Options back to Form object.
export const decodeAbiData = (
  abi: RecordOptions['abi'],
): AdvancedEditorType['other']['abi']['data'] => {
  return match(abi)
    .with({ contentType: 1 }, ({ encodedData }) => hexToString(encodedData))
    .otherwise(() => '')
}

type TabType = 'text' | 'address' | 'other'

type ExpandableRecordsGroup = 'text' | 'address'
type ExpandableRecordsState = {
  [key in ExpandableRecordsGroup]: string[]
}

type Props = {
  name: string
  profile?: Profile
  isLoading: boolean
  overwrites?: RecordOptions
  callback: (data: RecordOptions) => void
}

const useAdvancedEditor = ({ name, profile, isLoading, overwrites, callback }: Props) => {
  const { t } = useTranslation('profile')
  const client = useClient()

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
    const loadProfile = async (profile_: Profile) => {
      const formObject = await convertProfileToProfileFormObject(profile_)

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

    if (profile) {
      loadProfile(profile)
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

      overwrites?.coins?.forEach((coinType) => {
        const { coin, value } = coinType
        const isExisting = existingRecords.address.includes(coin as string)
        if (value && isExisting) {
          setValue(`address.${coin}`, value, { shouldDirty: true })
        } else if (value && !isExisting) {
          addAddressKey(coin as string)
          setValue(`address.${coin}`, value, { shouldDirty: true })
        } else if (!value && isExisting) {
          removeAddressKey(coin, false)
        } else if (!value && !isExisting) {
          removeAddressKey(coin, true)
        }
      })

      if (typeof overwrites?.contentHash === 'string') {
        setValue('other.contentHash', overwrites.contentHash, { shouldDirty: true })
      }

      if (overwrites?.abi) {
        // If is array then we know we are deleting the abi
        if (Array.isArray(overwrites.abi)) {
          const abi_ = {
            contentType: getValues('other.abi.contentType'),
            data: '',
          }
          setValue('other.abi', abi_, { shouldDirty: true })
        } else {
          const abi_ = {
            contentType: getValues('other.abi.contentType'),
            data: overwrites.abi.encodedData ? hexToString(overwrites.abi.encodedData) : '',
          }
          setValue('other.abi', abi_, { shouldDirty: true })
        }
      }

      setShouldRunOverwritesScript(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecords, shouldRunOverwritesScript])

  const handleRecordSubmit = async (editorData: AdvancedEditorType) => {
    const dirtyFields = getDirtyFields(formState.dirtyFields, editorData) as AdvancedEditorType

    const texts = Object.entries(getFieldsByType('text', dirtyFields)).map(([key, value]) => ({
      key,
      value,
    })) as { key: string; value: string }[]

    const coins = Object.entries<string>(getFieldsByType('addr', dirtyFields)).map(
      ([coin, value]) => ({
        coin,
        value: normalizeCoinAddress({ coin, address: value }),
      }),
    ) as { coin: string; value: string }[]

    const contentHash = dirtyFields.other?.contentHash

    const abi: EncodedAbi | EncodedAbi[] | undefined = await match<
      [EncodedAbi['contentType'] | 0 | undefined, string | undefined]
    >([getValues('other.abi.contentType'), dirtyFields.other?.abi?.data])
      .with([P.union(0, 1, 2, 4, 8), P.not(P.union('', undefined))], async ([, data]) => {
        return encodeAbi({ encodeAs: 'json', data: JSON.parse(data!) })
      })
      .with([P.union(1, 2, 4, 8), P.union(P.nullish, '')], async () => {
        const encodedAs = await getUsedAbiEncodeAs(client, { name })
        return Promise.all(encodedAs.map((encodeAs) => encodeAbi({ encodeAs, data: null })))
      })
      .otherwise(() => undefined)

    const records: RecordOptions = {
      texts,
      coins,
      contentHash,
      abi,
    }
    callback(records)
  }

  const { data: [hasAbiInterface] = [undefined], isLoading: isLoadingAbiInterface } =
    useResolverHasInterfaces({
      interfaceNames: ['AbiResolver'],
      resolverAddress: profile?.resolverAddress!,
      enabled: !isLoading,
    })

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
    hasAbiInterface,
    isLoadingAbiInterface,
    hasChanges,
    control,
  }
}

export default useAdvancedEditor
