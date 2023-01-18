import { useState } from 'react'
import { useQuery } from 'wagmi'

import { useChainId } from '@app/hooks/useChainId'
import { MOONPAY_WORKER_URL } from '@app/utils/constants'
import { getLabelFromName, labelHashCalc } from '@app/utils/utils'

export const useMoonpayRegistration = (dispatch, normalisedName, selected, item) => {
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
      get: (searchParams, prop) => searchParams.get(prop),
    })
    dispatch({
      name: 'setExternalTransactionId',
      externalTransactionId: params.externalTransactionId,
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
      const jsonResult = (await response.json()) as Array
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
