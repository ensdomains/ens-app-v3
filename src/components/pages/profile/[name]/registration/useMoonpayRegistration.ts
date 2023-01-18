import { useState } from 'react'
import { useQuery } from 'wagmi'

import { useChainId } from '@app/hooks/useChainId'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import { MOONPAY_WORKER_URL } from '@app/utils/constants'
import { getLabelFromName, labelHashCalc } from '@app/utils/utils'

import { MoonpayTransactionStatus } from './types'

export const useMoonpayRegistration = (
  dispatch: ReturnType<typeof useRegistrationReducer>['dispatch'],
  normalisedName: string,
  selected: { name: string; address: string },
  item: ReturnType<typeof useRegistrationReducer>['item'],
) => {
  const chainId = useChainId()
  const [hasMoonpayModal, setHasMoonpayModal] = useState(false)
  const [moonpayUrl, setMoonpayUrl] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const currentExternalTransactionId = item.externalTransactionId

  const initiateMoonpayRegistration = async () => {
    const label = getLabelFromName(normalisedName)
    const tokenId = labelHashCalc(label)
    const requestUrl = `${MOONPAY_WORKER_URL[chainId]}/signedurl?tokenId=${tokenId}&name=${normalisedName}&duration=1`
    const response = await fetch(requestUrl)
    const textResponse = await response.text()
    setMoonpayUrl(textResponse)

    const params = new Proxy(new URLSearchParams(textResponse), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    })
    dispatch({
      name: 'setExternalTransactionId',
      externalTransactionId: (params as unknown as { externalTransactionId: string })
        .externalTransactionId,
      selected,
    })
    setHasMoonpayModal(true)
  }

  // Monitor current transaction
  const { data: transactionData } = useQuery(
    ['currentExternalTransactionId', currentExternalTransactionId],
    async () => {
      const response = await fetch(
        `${MOONPAY_WORKER_URL[chainId]}/transactionInfo?externalTransactionId=${currentExternalTransactionId}`,
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
      }

      return result || {}
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchInterval: 1000,
      refetchIntervalInBackground: true,
      enabled: !!currentExternalTransactionId && !isCompleted,
    },
  )

  return {
    moonpayUrl,
    initiateMoonpayRegistration,
    hasMoonpayModal,
    setHasMoonpayModal,
    currentExternalTransactionId,
    moonpayTransactionStatus: transactionData?.status,
  }
}
