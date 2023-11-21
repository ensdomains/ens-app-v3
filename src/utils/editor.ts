import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedAccounts from '@app/constants/supportedSocialRecordKeys.json'
import { Profile } from '@app/types/index'

export const formSafeKey = (key: string) =>
  encodeURIComponent(key).replace(
    /[.!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  )

export const convertFormSafeKey = (key: string) => decodeURIComponent(key)

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
  abi?: {
    data: string
    contentType?: number
  }
}

export const convertProfileToProfileFormObject = (profile: Profile): ProfileFormObject => {
  const address =
    profile.coins?.reduce((map, record) => {
      const { name, value } = record
      if (name && supportedAddresses.includes(name.toLowerCase())) {
        const newMap = { [name]: value, ...map }
        return newMap
      }
      if (name) {
        const newMap = { ...map, [name]: value }
        return newMap
      }
      return map
    }, {}) || {}

  const textRecords = profile.texts?.reduce<Omit<ProfileFormObject, 'address' | 'website'>>(
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
      general: {},
      accounts: {},
      other: {},
    },
  ) || { general: {}, accounts: {}, other: {} }

  let website = ''
  const { contentHash } = profile
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
    abi: profile.abi
      ? {
          data:
            typeof profile.abi.abi === 'string' ? profile.abi.abi : JSON.stringify(profile.abi.abi),
          contentType: profile.abi.contentType,
        }
      : { data: '', contentType: 0 },
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
