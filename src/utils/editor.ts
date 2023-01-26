import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedAccounts from '@app/constants/supportedSocialRecordKeys.json'
import { Profile, RecordItem } from '@app/types/index'

export const formSafeKey = (key: string) => key.replace(/\./g, '\u2024')

export const convertFormSafeKey = (key: string) => key.replace(/\u2024/g, '.')

export type ProfileFormObject = {
  avatar?: string
  banner?: string
  website?: string
  general: {
    [key: string]: string
  }
  accounts: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    [key: string]: string
  }
}

export const convertProfileToProfileFormObject = (profile: Profile): ProfileFormObject => {
  const address =
    profile.records?.coinTypes?.reduce((map, record) => {
      const { coin } = record
      const { addr } = record as any
      if (coin && supportedAddresses.includes(coin.toLowerCase())) {
        const newMap = { [coin]: addr, ...map }
        return newMap
      }
      if (coin) {
        const newMap = { ...map, [coin]: addr }
        return newMap
      }
      return map
    }, {}) || {}

  const textRecords = profile.records?.texts?.reduce<
    Omit<ProfileFormObject, 'address' | 'website'>
  >(
    (map, record) => {
      if (record.key === 'avatar')
        return {
          avatar: record.value,
          ...map,
        }
      if (record.key === 'banner')
        return {
          banner: record.value,
          ...map,
        }
      const key = record.key.toString()
      const safeKey = formSafeKey(key)
      if (supportedProfileItems.includes(key)) {
        const newMap = {
          ...map,
          general: { ...map.general, [safeKey]: record.value },
        }
        return newMap
      }
      if (supportedAccounts.includes(key)) {
        return {
          ...map,
          accounts: { ...map.accounts, [safeKey]: record.value },
        }
      }
      return {
        ...map,
        other: {
          ...map.other,
          [safeKey]: record.value,
        },
      }
    },
    {
      general: {
        name: '',
      },
      accounts: {},
      other: {},
    },
  ) || { general: {}, accounts: {}, other: {} }

  let website = ''
  const contentHash = profile.records?.contentHash
  if (contentHash) {
    if (typeof contentHash === 'string') {
      website = contentHash
    } else if (typeof contentHash === 'object' && contentHash.decoded) {
      website = `${contentHash.protocolType}://${contentHash.decoded}`
    }
  }

  return {
    ...textRecords,
    address,
    website,
  }
}

// https://github.com/react-hook-form/react-hook-form/discussions/1991

type UnknownArrayOrObject = unknown[] | Record<string, unknown>

export const getDirtyFields = (
  dirtyFields: UnknownArrayOrObject | boolean,
  allValues: UnknownArrayOrObject,
): UnknownArrayOrObject => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues
  }

  if (typeof dirtyFields === 'object' && typeof allValues === 'object') {
    const dirtyFieldsObj = dirtyFields as Record<string, unknown>
    const allValuesObj = allValues as Record<string, unknown>
    return Object.fromEntries(
      Object.keys(dirtyFieldsObj).map((key: keyof Record<string, unknown>) => {
        const subDirtyFields = dirtyFields[key] as UnknownArrayOrObject | boolean
        const subAllValues = allValuesObj[key] as UnknownArrayOrObject
        return [key, getDirtyFields(subDirtyFields, subAllValues)]
      }),
    )
  }

  return {}
}

export const recordItemToKeyValue = (recordItem: RecordItem): { key: string; value: string } => {
  switch (recordItem.type) {
    case 'text':
      return { key: recordItem.key.toString(), value: recordItem.value }
    case 'addr':
      return { key: recordItem.coin!.toString(), value: (recordItem as any).addr }
    default:
      throw new Error(`Unsupported record type: ${recordItem.type}`)
  }
}
