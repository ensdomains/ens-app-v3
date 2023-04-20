import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import coinsWithoutIcons from '@app/constants/coinsWithoutIcons.json'
import supportedContentHashKeys from '@app/constants/supportedContentHashKeys.json'
import supportedGeneralRecordKeys from '@app/constants/supportedGeneralRecordKeys.json'
import supportedOtherRecordKeys from '@app/constants/supportedOtherRecordKeys.json'
import supportedSocialRecordKeys from '@app/constants/supportedSocialRecordKeys.json'

export type ProfileRecordGroup =
  | 'general'
  | 'media'
  | 'address'
  | 'social'
  | 'website'
  | 'other'
  | 'custom'

export type ProfileRecordType = 'text' | 'addr' | 'contenthash' | 'abi'

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

const address = [...coinsWithIcons, ...coinsWithoutIcons].map((coin) => ({
  key: coin.toUpperCase(),
  group: 'address',
  type: 'addr',
})) as ProfileRecord[]

const website: ProfileRecord[] = supportedContentHashKeys.map((key) => ({
  key,
  group: 'website',
  type: 'contenthash',
}))

const typeForOtherRecordKey = (key: string): ProfileRecordType => {
  if (key === 'contentHash') return 'contenthash'
  if (key === 'abi') return 'abi'
  return 'text'
}

const other: ProfileRecord[] = supportedOtherRecordKeys.map((key) => ({
  key,
  group: 'other',
  type: typeForOtherRecordKey(key),
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

export const sortValues: { [key: string]: { [key: string]: number } } = {
  media: {
    avatar: 1,
  },
  general: supportedGeneralRecordKeys.reduce<{ [key: string]: number }>((acc, key, index) => {
    acc[key] = index + 100
    return acc
  }, {}),
  social: supportedSocialRecordKeys.reduce<{ [key: string]: number }>((acc, key, index) => {
    acc[key] = index + 200
    return acc
  }, {}),
  address: coinsWithIcons.reduce<{ [key: string]: number }>((acc, key, index) => {
    if (key === 'eth') acc[key] = 1
    else acc[key] = index + 300
    return acc
  }, {}),
  website: supportedContentHashKeys.reduce<{ [key: string]: number }>((acc, key, index) => {
    acc[key] = index + 400
    return acc
  }, {}),
  other: supportedOtherRecordKeys.reduce<{ [key: string]: number }>((acc, key, index) => {
    acc[key] = index + 500
    return acc
  }, {}),
}
