import { Profile } from '@app/types/index'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedAccounts from '@app/constants/supportedTexts.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'

export const formSafeKey = (key: string) => key.replace(/\./g, '\u2024')

export const convertFormSafeKey = (key: string) => key.replace(/\u2024/g, '.')

export type ProfileType = {
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

export const convertProfileToFormObject = (profile: Profile): ProfileType => {
  const profileAddress =
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
    Omit<ProfileType, 'address'>
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
      if (supportedProfileItems.includes(record.key.toString())) {
        const newMap = {
          ...map,
          general: { ...map.general, [record.key]: record.value },
        }
        return newMap
      }
      if (supportedAccounts.includes(record.key.toString())) {
        const key = formSafeKey(record.key.toString())
        return {
          ...map,
          accounts: { ...map.accounts, [key]: record.value },
        }
      }
      return {
        ...map,
        other: {
          ...map.other,
          [formSafeKey(record.key.toString())]: record.value,
        },
      }
    },
    { general: {}, accounts: {}, website: {}, other: {} },
  ) || { general: {}, accounts: {}, website: {}, other: {} }

  return {
    ...textRecords,
    address: profileAddress,
  }
}
