import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { labelhash } from 'viem'
import { useChainId } from 'wagmi'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import { sendEvent } from '@app/utils/analytics/events'
import { MOONPAY_WORKER_URL } from '@app/utils/constants'
import { useQuery } from '@app/utils/query/useQuery'
import { getLabelFromName } from '@app/utils/utils'

import { MoonpayTransactionStatus, SelectedItemProperties } from './types'

export const useMoonpayRegistration = (
  dispatch: ReturnType<typeof useRegistrationReducer>['dispatch'],
  normalisedName: string,
  selected: SelectedItemProperties,
  item: ReturnType<typeof useRegistrationReducer>['item'],
) => {
  const chainId = useChainId()
  const { address } = useAccountSafely()
  const [hasMoonpayModal, setHasMoonpayModal] = useState(false)
  const [moonpayUrl, setMoonpayUrl] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const currentExternalTransactionId = item.externalTransactionId

  const initiateMoonpayRegistrationMutation = useMutation({
    mutationFn: async (duration: number = 1) => {
      const label = getLabelFromName(normalisedName)
      const tokenId = labelhash(label)

      const requestUrl = `${
        MOONPAY_WORKER_URL[chainId]
      }/signedurl?tokenId=${tokenId}&name=${encodeURIComponent(
        normalisedName,
      )}&duration=${duration}&walletAddress=${address}`
      const response = await fetch(requestUrl)
      const textResponse = await response.text()
      setMoonpayUrl(textResponse)

      const params = new URLSearchParams(textResponse)
      const externalTransactionId = params.get('externalTransactionId') || ''

      dispatch({
        name: 'setExternalTransactionId',
        externalTransactionId,
        selected,
      })
      setHasMoonpayModal(true)

      sendEvent('register:moonpay_start', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        external_transaction_id: externalTransactionId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: normalisedName,
        duration,
      })
    },
  })

  const { queryKey } = useQueryOptions({
    params: { externalTransactionId: currentExternalTransactionId },
    functionName: 'getMoonpayStatus',
    queryDependencyType: 'standard',
    keyOnly: true,
  })

  // Monitor current transaction
  const { data: transactionData } = useQuery({
    queryKey,
    // TODO: refactor this func and pull query fn out of the hook
    queryFn: async ({ queryKey: [{ externalTransactionId }] }) => {
      const response = await fetch(
        `${MOONPAY_WORKER_URL[chainId]}/transactionInfo?externalTransactionId=${externalTransactionId}`,
      )
      const jsonResult = (await response.json()) as Array<{ status: MoonpayTransactionStatus }>
      const result = jsonResult?.[0]

      if (result?.status === 'completed' && !isCompleted) {
        setIsCompleted(true)
        setHasMoonpayModal(false)
        dispatch({
          name: 'moonpayTransactionCompleted',
          selected,
        })

        sendEvent('register:moonpay_complete', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          external_transaction_id: externalTransactionId,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: normalisedName,
        })
      }

      return result || {}
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: !!currentExternalTransactionId && !isCompleted && chainId === 1,
  })

  return {
    moonpayUrl,
    initiateMoonpayRegistrationMutation,
    hasMoonpayModal,
    setHasMoonpayModal,
    currentExternalTransactionId,
    moonpayTransactionStatus: transactionData?.status as MoonpayTransactionStatus,
  }
}
