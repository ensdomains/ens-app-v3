import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { useAccount, useQuery } from 'wagmi'

import { Dialog, Helper } from '@ensdomains/thorin'

import { baseFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { useChainId } from '@app/hooks/useChainId'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import useResolverExists from '@app/hooks/useResolverExists'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { MOONPAY_LINK_GENERATOR_URL } from '@app/utils/constants'
import { getLabelFromName, isLabelTooLong, labelHashCalc } from '@app/utils/utils'

import Complete from './steps/Complete'
import Info, { PaymentMethod } from './steps/Info'
import Pricing from './steps/Pricing/Pricing'
import Profile from './steps/Profile/Profile'
import Transactions from './steps/Transactions'
import { BackObj, RegistrationStepData } from './types'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const StyledDialog = styled(Dialog)(
  () => css`
    max-width: 100vw;
    width: 90vw;
    height: 90vh;

    & > div {
      max-width: 90vw;
      width: 90vw;
      height: 90vh;
    }
    & > div > div {
      max-width: 90vw;
      height: 90vh;
    }
  `,
)

// We dont' need to save the externalTransactionId until the state switches to pending
// If the status of the current transaction is anything other than pending then it
// can be overwritten, we will just start a new flow
const useMoonpayRegistration = (dispatch, normalisedName, selected, item) => {
  // const previousExternalTransactionId = usePrevious(externalTransactionId)
  const chainId = useChainId()
  const [hasMoonpayModal, setHasMoonpayModal] = useState(false)
  const [moonpayUrl, setMoonpayUrl] = useState('')
  const [currentExternalTransactionId, setCurrentExternalTransactionId] = useState('')

  useEffect(() => {
    if (item.externalTransactionId) {
      console.log('setCurrentExternalTransactionId: ', item.externalTransactionId)
      setCurrentExternalTransactionId(item.externalTransactionId)
    }
  }, [item.externalTransactionId])

  const initiateMoonpayRegistration = async () => {
    const label = getLabelFromName(normalisedName)
    const tokenId = labelHashCalc(label)
    const requestUrl = `${MOONPAY_LINK_GENERATOR_URL[chainId]}?tokenId=${tokenId}&name=${normalisedName}&duration=1`
    const response = await fetch(requestUrl)
    const textResponse = await response.text()
    console.log('textResponse: ', textResponse)
    setMoonpayUrl(textResponse)

    const params = new Proxy(new URLSearchParams(textResponse), {
      get: (searchParams, prop) => searchParams.get(prop),
    })
    // const { externalTransactionId } = params
    console.log('externalId: ', params.externalTransactionId)

    setCurrentExternalTransactionId(params.externalTransactionId)
    setHasMoonpayModal(true)
  }

  // Monitor current transaction
  const { data: transactionData } = useQuery(
    ['currentExternalTransactionId', currentExternalTransactionId],
    async () => {
      const response = await fetch(
        `https://moonpay-goerli.ens-cf.workers.dev/transactionInfo?externalTransactionId=${currentExternalTransactionId}`,
      )
      const jsonResult = (await response.json()) as Array
      const result = jsonResult?.[0]
      console.log('result: ', result)
      console.log('result.status: ', result?.status)

      if (result?.status === 'pending') {
        dispatch({
          name: 'setExternalTransactionId',
          externalTransactionId: currentExternalTransactionId,
          selected,
        })
      }

      if (result?.status === 'completed') {
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
      enabled: !!currentExternalTransactionId,
    },
  )

  console.log('transactionData: ', transactionData)

  return {
    moonpayUrl,
    initiateMoonpayRegistration,
    hasMoonpayModal,
    setHasMoonpayModal,
    currentExternalTransactionId,
    transactionStatus: transactionData?.status,
  }
}

const Registration = ({ nameDetails, isLoading }: Props) => {
  const { t } = useTranslation('register')

  const router = useRouterWithHistory()
  const { address } = useAccount()
  const { name: primaryName, loading: primaryLoading } = usePrimary(address!, !address)
  const selected = { name: nameDetails.normalisedName, address: address! }
  const { normalisedName } = nameDetails
  const defaultResolverAddress = useContractAddress('PublicResolver')
  const { data: resolverExists, isLoading: resolverExistsLoading } = useResolverExists(
    normalisedName,
    defaultResolverAddress,
  )
  const labelTooLong = isLabelTooLong(normalisedName)
  const { dispatch, item } = useRegistrationReducer(selected)
  const step = item.queue[item.stepIndex]

  const keySuffix = `${nameDetails.normalisedName}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`

  const { cleanupFlow } = useTransactionFlow()

  const {
    moonpayUrl,
    initiateMoonpayRegistration,
    hasMoonpayModal,
    setHasMoonpayModal,
    transactionStatus,
  } = useMoonpayRegistration(dispatch, normalisedName, selected, item)

  console.log('item: ', item)

  const pricingCallback = ({ years, reverseRecord }: RegistrationStepData['pricing']) => {
    dispatch({ name: 'setPricingData', payload: { years, reverseRecord }, selected })
    if (!item.queue.includes('profile')) {
      // if profile is not in queue, set the default profile data
      dispatch({
        name: 'setProfileData',
        payload: {
          records: {
            coinTypes: [{ key: 'ETH', value: address! } as any],
            clearRecords: resolverExists,
          },
          permissions: baseFuseObj,
          resolver: defaultResolverAddress,
        },
        selected,
      })
      if (reverseRecord) {
        // if reverse record is selected, add the profile step to the queue
        dispatch({
          name: 'setQueue',
          payload: ['pricing', 'profile', 'info', 'transactions', 'complete'],
          selected,
        })
      }
    }
    dispatch({ name: 'increaseStep', selected })
  }

  const profileCallback = ({
    records,
    resolver,
    permissions,
    back,
  }: RegistrationStepData['profile'] & BackObj) => {
    dispatch({ name: 'setProfileData', payload: { records, resolver, permissions }, selected })
    dispatch({ name: back ? 'decreaseStep' : 'increaseStep', selected })
  }

  const genericCallback = ({ back }: BackObj) => {
    dispatch({ name: back ? 'decreaseStep' : 'increaseStep', selected })
  }

  const transactionsCallback = ({ back, resetSecret }: BackObj & { resetSecret?: boolean }) => {
    if (resetSecret) {
      dispatch({ name: 'resetSecret', selected })
    }
    genericCallback({ back })
  }

  const infoProfileCallback = () => {
    dispatch({
      name: 'setQueue',
      payload: ['pricing', 'profile', 'info', 'transactions', 'complete'],
      selected,
    })
  }

  const onStart = () => {
    dispatch({ name: 'setStarted', selected })
  }

  const onComplete = (toProfile: boolean) => {
    router.push(toProfile ? `/profile/${normalisedName}` : '/')
  }

  const infoCallback = (arg: { back?: boolean; paymentMethodChoice?: PaymentMethod }) => {
    if (arg.back) {
      dispatch({ name: 'decreaseStep', selected })
      return
    }
    if (arg.paymentMethodChoice === PaymentMethod.ethereum) {
      dispatch({ name: 'increaseStep', selected })
      return
    }
    // setHasMoonpayModal(true)
    // dispatch({ name: 'increaseStep', selected })
    initiateMoonpayRegistration()
  }

  useEffect(() => {
    const handleRouteChange = (e: string) => {
      if (e !== router.asPath && step === 'complete') {
        dispatch({ name: 'clearItem', selected })
        cleanupFlow(commitKey)
        cleanupFlow(registerKey)
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, step, selected, router.asPath])

  return (
    <>
      <Head>
        <title>{t('title', { name: normalisedName })}</title>
      </Head>
      <Content
        noTitle
        title={normalisedName}
        hideHeading={step === 'complete'}
        subtitle={t('subtitle')}
        loading={labelTooLong ? false : isLoading || primaryLoading || resolverExistsLoading}
        singleColumnContent
      >
        {{
          trailing: labelTooLong ? (
            <Helper type="error">{t('error.nameTooLong')}</Helper>
          ) : (
            {
              pricing: (
                <Pricing
                  resolverExists={resolverExists}
                  nameDetails={nameDetails}
                  callback={pricingCallback}
                  hasPrimaryName={!!primaryName}
                  registrationData={item}
                />
              ),
              profile: (
                <Profile
                  resolverExists={resolverExists}
                  nameDetails={nameDetails}
                  registrationData={item}
                  callback={profileCallback}
                />
              ),
              info: (
                <Info
                  resolverExists={resolverExists}
                  nameDetails={nameDetails}
                  registrationData={item}
                  callback={infoCallback}
                  onProfileClick={infoProfileCallback}
                  hasPrimaryName={!!primaryName}
                  transactionStatus={transactionStatus}
                />
              ),
              transactions: (
                <Transactions
                  nameDetails={nameDetails}
                  registrationData={item}
                  onStart={onStart}
                  callback={transactionsCallback}
                />
              ),
              complete: <Complete nameDetails={nameDetails} callback={onComplete} />,
            }[step]
          ),
        }}
      </Content>
      <StyledDialog open={hasMoonpayModal} variant="actionable">
        <iframe title="Moonpay Checkout" width="100%" height="90%" src={moonpayUrl} />
      </StyledDialog>
    </>
  )
}

// hasPendingMoonpayTransaction={transactionStatus === 'pending'}

export default Registration
