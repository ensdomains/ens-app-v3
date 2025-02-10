import { decodeEventLog } from 'viem'

import {
  ethRegistrarControllerNameRegisteredEventSnippet,
  legacyEthRegistrarControllerNameRegisteredEventSnippet,
} from '@ensdomains/ensjs/contracts'

import { MinedData } from '@app/types'
import { useQuery } from '@app/utils/query/useQuery'

const decodeLegacyNameRegisteredEventLog = (log: MinedData['logs'][number]): Promise<bigint> =>
  new Promise((resolve, reject) => {
    try {
      const t = decodeEventLog({
        abi: legacyEthRegistrarControllerNameRegisteredEventSnippet,
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

const decodeWrappedNameRegisteredEventLog = (log: MinedData['logs'][number]): Promise<bigint> =>
  new Promise((resolve, reject) => {
    try {
      const t = decodeEventLog({
        abi: ethRegistrarControllerNameRegisteredEventSnippet,
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
