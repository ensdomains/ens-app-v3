import { match, P } from 'ts-pattern'

import { EncodedAbi } from '@ensdomains/ensjs/dist/types/utils/encoders/encodeAbi'

import { supportedAddresses } from '@app/constants/supportedAddresses'
import { supportedGeneralRecordKeys } from '@app/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '@app/constants/supportedSocialRecordKeys'
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
    contentType?: EncodedAbi['contentType'] | 0
  }
}

export const convertProfileToProfileFormObject = async (
  profile: Profile,
): Promise<ProfileFormObject> => {
  const address =
    profile.coins?.reduce((map, record) => {
      const { name, value } = record
      if (
        name &&
        supportedAddresses.includes(name.toLowerCase() as (typeof supportedAddresses)[number])
      ) {
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
      if (supportedGeneralRecordKeys.includes(key as (typeof supportedGeneralRecordKeys)[number])) {
        const newMap = {
          ...map,
          general: { ...map.general, [safeKey]: record.value },
        }
        return newMap
      }
      if (supportedSocialRecordKeys.includes(key as (typeof supportedSocialRecordKeys)[number])) {
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

  const abi = await match({
    contentType: profile?.abi?.contentType,
    data: profile.abi?.abi,
  })
    .with({ contentType: P.union(1, 3, 4) }, ({ contentType, data }) => {
      try {
        return {
          contentType,
          data: JSON.stringify(data),
        } as ProfileFormObject['abi']
      } catch {
        return { contentType, data: '' } as ProfileFormObject['abi']
      }
    })
    .with({ contentType: 8 }, async ({ contentType, data }) => {
      try {
        const test = await fetch(data as string)
        const json = await test.json()
        return { contentType, data: JSON.stringify(json) } as ProfileFormObject['abi']
      } catch {
        return { contentType, data: '' } as ProfileFormObject['abi']
      }
    })
    .otherwise(() => ({ contentType: 0, data: '' }) as ProfileFormObject['abi'])

  return {
    ...textRecords,
    address,
    website,
    abi,
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
