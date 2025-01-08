import { decodeEventLog } from 'viem'

import { MinedData } from '@app/types'
import { useQuery } from '@app/utils/query/useQuery'

const legacyNameRegisteredEventSnippet = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: true, internalType: 'bytes32', name: 'label', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'cost', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'expires', type: 'uint256' },
    ],
    name: 'NameRegistered',
    type: 'event',
  },
] as const

const decodeLegacyNameRegisteredEventLog = (log: MinedData['logs'][number]): Promise<bigint> =>
  new Promise((resolve, reject) => {
    try {
      const t = decodeEventLog({
        abi: legacyNameRegisteredEventSnippet,
        topics: log.topics,
        data: log.data,
        eventName: 'NameRegistered',
      })
      if (!t.args.cost) reject()
      resolve(t.args.cost)
    } catch {
      reject()
    }
  })

const nameRegisteredEventSnippet = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        name: 'label',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        name: 'baseCost',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'premium',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'expires',
        type: 'uint256',
      },
    ],
    name: 'NameRegistered',
    type: 'event',
  },
] as const

const decodeWrappedNameRegisteredEventLog = (log: MinedData['logs'][number]): Promise<bigint> =>
  new Promise((resolve, reject) => {
    try {
      const t = decodeEventLog({
        abi: nameRegisteredEventSnippet,
        topics: log.topics,
        data: log.data,
        eventName: 'NameRegistered',
      })
      resolve(t.args.baseCost + t.args.premium)
    } catch {
      reject()
    }
  })

export const useRegistrationValueFromRegisterReceipt = ({
  registerReceipt,
}: {
  registerReceipt?: MinedData
}) => {
  return useQuery({
    queryKey: ['registration-value', registerReceipt],
    queryFn: async () => {
      try {
        const promises = registerReceipt!.logs
          .map((log) => [
            decodeLegacyNameRegisteredEventLog(log),
            decodeWrappedNameRegisteredEventLog(log),
          ])
          .flat()
        return await Promise.any(promises)
      } catch {
        return null
      }
    },
    enabled: !!registerReceipt,
    retry: false,
  })
}
