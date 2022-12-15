import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedContentHashKeys from '@app/constants/supportedContentHashKeys.json'
import supportedGeneralRecordKeys from '@app/constants/supportedGeneralRecordKeys.json'
import supportedOtherRecordKeys from '@app/constants/supportedOtherRecordKeys.json'
import supportedSocialRecordKeys from '@app/constants/supportedSocialRecordKeys.json'

import coinList from './coinList'

export type ProfileRecordGroup =
  | 'general'
  | 'media'
  | 'address'
  | 'social'
  | 'website'
  | 'other'
  | 'custom'

export type ProfileRecordType = 'text' | 'addr' | 'contenthash'

export type ProfileRecord = {
  key: string
  value?: string
  type: ProfileRecordType
  group: ProfileRecordGroup
}

const general: ProfileRecord[] = supportedGeneralRecordKeys.map((key) => ({
  key,
  group: 'general',
  type: 'text',
}))

const social: ProfileRecord[] = supportedSocialRecordKeys.map((key) => ({
  key,
  group: 'social',
  type: 'text',
}))

const _address = coinList.reduce<ProfileRecord[]>((acc, coin) => {
  const record: ProfileRecord = {
    key: coin,
    group: 'address',
    type: 'addr',
  }
  if (coin === 'ETH') return acc
  if (supportedAddresses.includes(coin.toLowerCase())) return [record, ...acc]
  return [...acc, record]
}, [])
const address: ProfileRecord[] = [{ key: 'ETH', group: 'address', type: 'addr' }, ..._address]

const website: ProfileRecord[] = supportedContentHashKeys.map((key) => ({
  key,
  group: 'website',
  type: 'contenthash',
}))

const other: ProfileRecord[] = supportedOtherRecordKeys.map((key) => ({
  key,
  group: 'other',
  type: key === 'contentHash' ? 'contenthash' : 'text',
}))

export default [...general, ...social, ...address, ...website, ...other]
export const grouped: {
  group: ProfileRecordGroup
  items: ProfileRecord[]
}[] = [
  {
    group: 'general',
    items: general,
  },
  {
    group: 'social',
    items: social,
  },
  {
    group: 'address',
    items: address,
  },
  {
    group: 'website',
    items: website,
  },
  {
    group: 'other',
    items: other,
  },
]
