import {
  useMutation,
  type QueryFunctionContext,
  type UseMutationResult,
} from '@tanstack/react-query'
import { useState } from 'react'
import { labelhash, type Address } from 'viem'

import type { SupportedChain } from '@app/constants/chains'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { useTransactionManager } from '@app/transaction/transactionManager'
import type { ConfigWithEns, CreateQueryKey } from '@app/types'
import { MOONPAY_WORKER_URL } from '@app/utils/constants'
import { useQuery } from '@app/utils/query/useQuery'
import { getLabelFromName } from '@app/utils/utils'

import { MoonpayTransactionStatus } from './types'

type MoonpayRegistrationMutationParameters = {
  duration: number
  name: string
  chainId: SupportedChain['id']
  address: Address
}

type MoonpayRegistrationMutationReturnType = {
  externalTransactionId: string
  moonpayUrl: string
}

const initiateMoonpayRegistrationMutationFn = async ({
  name,
  duration,
  chainId,
  address,
}: MoonpayRegistrationMutationParameters): Promise<MoonpayRegistrationMutationReturnType> => {
  const label = getLabelFromName(name)
  const tokenId = labelhash(label)

  const requestUrl = `${
    MOONPAY_WORKER_URL[chainId]
  }/signedurl?tokenId=${tokenId}&name=${encodeURIComponent(
    name,
  )}&duration=${duration}&walletAddress=${address}`

  const response = await fetch(requestUrl)
  const moonpayUrl = await response.text()

  const params = new URLSearchParams(moonpayUrl)
  const externalTransactionId = params.get('externalTransactionId')

  if (!externalTransactionId) throw new Error('No external transaction id found')

  return { externalTransactionId, moonpayUrl }
}

export type InitiateMoonpayRegistrationMutationResult = UseMutationResult<
  MoonpayRegistrationMutationReturnType,
  Error,
  MoonpayRegistrationMutationParameters,
  unknown
>

type GetMoonpayStatusQueryParameters = {
  name: string
  externalTransactionId: string
}
type GetMoonpayStatusQueryKey = CreateQueryKey<
  GetMoonpayStatusQueryParameters,
  'getMoonpayStatus',
  'standard'
>

const getMoonpayStatusQueryFn =
  (_config: ConfigWithEns) =>
  async ({
    queryKey: [{ name, externalTransactionId }, chainId, address],
  }: QueryFunctionContext<GetMoonpayStatusQueryKey>) => {
    if (!address) throw new Error('No address found')

    const response = await fetch(
      `${MOONPAY_WORKER_URL[chainId]}/transactionInfo?externalTransactionId=${externalTransactionId}`,
    )
    const jsonResult = (await response.json()) as Array<{ status: MoonpayTransactionStatus }>
    const result = jsonResult?.[0]

    if (result?.status === 'completed') {
      useTransactionManager.getState().onRegistrationMoonpayTransactionCompleted(name, {
        sourceChainId: chainId,
        account: address,
      })
    }

    return result || {}
  }

export const useMoonpayRegistration = (normalisedName: string) => {
  const [hasMoonpayModal, setHasMoonpayModal] = useState(false)

  const currentExternalTransactionId = useTransactionManager(
    (s) => s.getCurrentRegistrationFlowOrDefault(normalisedName).externalTransactionData?.id,
  )
  const setRegistrationExternalTransactionData = useTransactionManager(
    (s) => s.setRegistrationExternalTransactionData,
  )

  const initiateMoonpayRegistrationMutation = useMutation({
    mutationFn: initiateMoonpayRegistrationMutationFn,
    onSuccess: (data, variables) => {
      setRegistrationExternalTransactionData(
        variables.name,
        {
          id: data.externalTransactionId,
          url: data.moonpayUrl,
          type: 'moonpay',
        },
        {
          sourceChainId: variables.chainId,
          account: variables.address,
        },
      )
    },
  })

  const { queryKey, queryFn } = useQueryOptions({
    params: { name: normalisedName, externalTransactionId: currentExternalTransactionId! },
    functionName: 'getMoonpayStatus',
    queryDependencyType: 'standard',
    queryFn: getMoonpayStatusQueryFn,
  })

  // Monitor current transaction
  const { data: transactionData } = useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!currentExternalTransactionId,
  })

  return {
    initiateMoonpayRegistrationMutation,
    hasMoonpayModal,
    setHasMoonpayModal,
    moonpayTransactionStatus: transactionData?.status as MoonpayTransactionStatus,
  }
}
