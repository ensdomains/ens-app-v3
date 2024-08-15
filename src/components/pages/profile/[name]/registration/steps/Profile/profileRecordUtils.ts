import { hexToString, stringToHex } from 'viem'

import { ClientWithEns } from '@ensdomains/ensjs/dist/types/contracts/consts'
import { encodeAbi, EncodedAbi, getProtocolType, RecordOptions } from '@ensdomains/ensjs/utils'

import { ProfileRecord, ProfileRecordGroup, sortValues } from '@app/constants/profileRecordOptions'
import { supportedGeneralRecordKeys } from '@app/constants/supportedGeneralRecordKeys'
import { supportedSocialRecordKeys } from '@app/constants/supportedSocialRecordKeys'
import type { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { Profile } from '@app/types'
import { getUsedAbiEncodeAs } from '@app/utils/abi'
import { normalizeCoinAddress } from '@app/utils/coin'
import { contentHashToString, getContentHashProvider } from '@app/utils/contenthash'

export const isEthAddressRecord = (record: ProfileRecord): boolean => {
  return record.group === 'address' && record.key === 'eth' && record.type === 'addr'
}

export const profileRecordsToRecordOptions = (
  profileRecords: ProfileRecord[] = [],
  clearRecords = false,
): RecordOptions => {
  return profileRecords.reduce<RecordOptions>(
    (options, record) => {
      if (!record.key) return options

      const { key, value = '', group } = record

      const recordItem = {
        key: key.trim(),
        value: value.trim(),
      }

      if (record.key === 'avatar') {
        const currentAvatarValue = options.texts?.find((r) => r.key === 'avatar')?.value || ''
        const defaultAvatarValue =
          !!currentAvatarValue && !!recordItem.value && group === 'media'
            ? recordItem.value
            : currentAvatarValue
        const newAvatarValue = defaultAvatarValue || currentAvatarValue || recordItem.value
        return {
          ...options,
          texts: [
            ...(options.texts?.filter((r) => r.key !== 'avatar') || []),
            { key: 'avatar', value: newAvatarValue },
          ],
        }
      }

      if (record.type === 'text') {
        return {
          ...options,
          texts: [...(options.texts?.filter((r) => r.key !== recordItem.key) || []), recordItem],
        }
      }

      if (record.type === 'addr') {
        return {
          ...options,
          coins: [
            ...(options.coins?.filter((r) => r.coin !== recordItem.key) || []),
            {
              coin: recordItem.key,
              value: normalizeCoinAddress({ coin: recordItem.key, address: recordItem.value }),
            },
          ],
        }
      }

      if (record.type === 'contenthash') {
        return {
          ...options,
          contentHash: recordItem.value,
        }
      }

      if (record.type === 'abi') {
        return {
          ...options,
          abi: {
            contentType: 1,
            encodedData: stringToHex(recordItem.value),
          },
        }
      }

      return options
    },
    {
      clearRecords: !!clearRecords,
    } as RecordOptions,
  )
}

export const profileRecordsToRecordOptionsWithDeleteAbiArray = async (
  client: ClientWithEns,
  {
    name = '',
    profileRecords = [],
    clearRecords = false,
  }: {
    name: string
    profileRecords: ProfileRecord[]
    clearRecords?: boolean
  },
) => {
  const recordOptions = profileRecordsToRecordOptions(profileRecords, clearRecords)
  if (!recordOptions.abi) return recordOptions
  const abi = recordOptions.abi as EncodedAbi
  if (hexToString(abi.encodedData)) return recordOptions
  const allAbiEncodedAs = await getUsedAbiEncodeAs(client, { name })
  const abis = await Promise.all(
    allAbiEncodedAs.map((encodeAs) => encodeAbi({ encodeAs, data: null })),
  )
  return {
    ...recordOptions,
    abi: abis,
  }
}

export const profileEditorFormToProfileRecords = (data: ProfileEditorForm): ProfileRecord[] => {
  return [
    ...data.records,
    ...(data.avatar
      ? [
          {
            key: 'avatar',
            type: 'text',
            group: 'media',
            value: data.avatar,
          } as ProfileRecord,
        ]
      : []),
  ]
}

export const profileRecordsToProfileEditorForm = (records: ProfileRecord[]): ProfileEditorForm => {
  return records.reduce<{ avatar: string; records: ProfileRecord[] }>(
    (result, record) => {
      if (record.key === 'avatar' && record.group === 'media')
        return { ...result, avatar: record.value || '' }
      const normalizedRecord = {
        ...record,
        value: record.value || '',
      }
      return {
        ...result,
        records: [...result.records, normalizedRecord],
      }
    },
    { avatar: '', records: [] },
  )
}

const sortProfileRecords = (recordA: ProfileRecord, recordB: ProfileRecord): number => {
  const unknownGroupValue: { [key in ProfileRecordGroup]: number } = {
    media: 1,
    general: 199,
    social: 299,
    address: 399,
    website: 499,
    other: 599,
    custom: 999,
  }
  const recordAValue =
    sortValues[recordA.group]?.[recordA.key.toLowerCase()] || unknownGroupValue[recordA.group]
  const recordBValue =
    sortValues[recordB.group]?.[recordB.key.toLowerCase()] || unknownGroupValue[recordB.group]
  return recordAValue - recordBValue
}

export const profileToProfileRecords = (profile?: Profile): ProfileRecord[] => {
  const records = profile || {}
  const texts: ProfileRecord[] =
    records.texts?.map(({ key, value }) => {
      if (key === 'avatar') {
        return {
          key: key as string,
          type: 'text',
          group: 'media',
          value,
        }
      }
      /* eslint-disable no-nested-ternary */
      const group: ProfileRecordGroup = supportedGeneralRecordKeys.includes(
        key as (typeof supportedGeneralRecordKeys)[number],
      )
        ? 'general'
        : supportedSocialRecordKeys.includes(key as (typeof supportedSocialRecordKeys)[number])
        ? 'social'
        : 'custom'
      /* eslint-enable no-nested-ternary */
      return {
        key: key as string,
        type: 'text',
        group,
        value,
      }
    }) || []
  const addresses: ProfileRecord[] =
    records.coins?.map(({ name, value }) => {
      return {
        key: name,
        type: 'addr',
        group: 'address',
        value,
      }
    }) || []

  const contentHashStr = contentHashToString(records.contentHash)
  const protocolTypeData = getProtocolType(contentHashStr)!
  const protocolKey = protocolTypeData && getContentHashProvider(protocolTypeData.protocolType)
  const website: ProfileRecord[] = protocolKey
    ? [{ key: protocolKey, type: 'contenthash', group: 'website', value: contentHashStr }]
    : []

  const abi: ProfileRecord[] = records.abi?.abi
    ? [{ key: 'abi', type: 'abi', group: 'other', value: JSON.stringify(records.abi.abi) }]
    : []
  const eth: ProfileRecord[] = addresses.find(isEthAddressRecord)
    ? []
    : [
        {
          key: 'eth',
          type: 'addr',
          group: 'address',
          value: '',
        },
      ]
  const profileRecords = [...texts, ...addresses, ...website, ...abi, ...eth]
  const sortedProfileRecords = profileRecords.sort(sortProfileRecords)
  return sortedProfileRecords
}

export const getProfileRecordsDiff = (
  currentRecords: ProfileRecord[],
  previousRecords: ProfileRecord[] = [],
): ProfileRecord[] => {
  const updatedAndNewRecords = currentRecords
    .map((currentRecord) => {
      const identicalRecord = previousRecords.find(
        (previousRecord) =>
          previousRecord.key === currentRecord.key && previousRecord.group === currentRecord.group,
      )
      // remove records that are empty
      if (!currentRecord.value && !isEthAddressRecord(currentRecord)) return null
      // record is new
      if (!identicalRecord) return currentRecord
      // record is updated
      if (identicalRecord.value !== currentRecord.value) return currentRecord
      // remove records that have not changed
      return null
    })
    .filter((r) => !!r) as ProfileRecord[]
  const deletedRecords = previousRecords
    .filter((previousRecord) => {
      // Can only have a single website, so check that no other website exists
      if (previousRecord.group === 'website')
        return currentRecords.findIndex((currentRecord) => currentRecord.group === 'website') === -1
      return (
        currentRecords.findIndex(
          (currentRecord) =>
            currentRecord.key === previousRecord.key &&
            currentRecord.group === previousRecord.group,
        ) === -1
      )
    })
    .map((r) => ({
      ...r,
      value: '',
    }))
  return [...updatedAndNewRecords, ...deletedRecords]
}
