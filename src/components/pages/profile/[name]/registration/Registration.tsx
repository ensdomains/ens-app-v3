import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { Helper } from '@ensdomains/thorin'

import { baseFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import useResolverExists from '@app/hooks/useResolverExists'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { isLabelTooLong } from '@app/utils/utils'

import Complete from './steps/Complete'
import Info from './steps/Info'
import Pricing from './steps/Pricing/Pricing'
import Profile from './steps/Profile/Profile'
import Transactions from './steps/Transactions'
import { BackObj, RegistrationStepData } from './types'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
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

  const pricingCallback = ({ years, reverseRecord }: RegistrationStepData['pricing']) => {
    dispatch({ name: 'setPricingData', payload: { years, reverseRecord }, selected })
    if (!item.queue.includes('profile')) {
      // if profile is not in queue, set the default profile data
      dispatch({
        name: 'setProfileData',
        payload: {
          records: [{ key: 'ETH', group: 'address', type: 'addr', value: address! }],
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
                  nameDetails={nameDetails}
                  registrationData={item}
                  callback={genericCallback}
                  onProfileClick={infoProfileCallback}
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
    </>
  )
}

export default Registration
