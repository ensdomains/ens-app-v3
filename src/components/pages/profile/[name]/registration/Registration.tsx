import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import { Content } from '@app/layouts/Content'

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

// needed:
// - clear existing records in profile (if setting)
// - if not setting as primary name, dont show profile step unless specified

const Registration = ({ nameDetails, isLoading }: Props) => {
  const router = useRouter()
  const { address } = useAccount()
  const { name: primaryName, loading: primaryLoading } = usePrimary(address!, !address)
  const selected = { name: nameDetails.normalisedName, address: address! }
  const { normalisedName } = nameDetails

  const { dispatch, item } = useRegistrationReducer(selected)

  const pricingCallback = ({ years, reverseRecord }: RegistrationStepData['pricing']) => {
    dispatch({ name: 'setPricingData', payload: { years, reverseRecord }, selected })
    dispatch({ name: 'setStep', payload: 'profile', selected })
  }

  const profileCallback = ({
    records,
    resolver,
    permissions,
    back,
  }: RegistrationStepData['profile'] & BackObj) => {
    dispatch({ name: 'setProfileData', payload: { records, resolver, permissions }, selected })
    dispatch({ name: 'setStep', payload: back ? 'pricing' : 'info', selected })
  }

  const infoCallback = ({ back }: BackObj) => {
    dispatch({ name: 'setStep', payload: back ? 'profile' : 'transactions', selected })
  }

  const transactionsCallback = ({ back }: BackObj) => {
    dispatch({ name: 'setStep', payload: back ? 'info' : 'complete', selected })
  }

  const onStart = () => {
    dispatch({ name: 'setStarted', selected })
  }

  const onComplete = (toProfile: boolean) => {
    router.push(toProfile ? `/profile/${normalisedName}` : '')
  }

  useEffect(() => {
    const handleRouteChange = (e: string) => {
      if (e !== router.asPath && item.step === 'complete') {
        dispatch({ name: 'clearItem', selected })
      }
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, item.step, selected, router.asPath])

  return (
    <>
      <Head>
        <title>Register {normalisedName}</title>
      </Head>
      <Content
        noTitle
        title={normalisedName}
        hideHeading={item.step === 'complete'}
        subtitle="Register"
        loading={isLoading || primaryLoading}
        singleColumnContent
      >
        {{
          trailing: {
            pricing: (
              <Pricing
                nameDetails={nameDetails}
                callback={pricingCallback}
                hasPrimaryName={!!primaryName}
                registrationData={item}
              />
            ),
            profile: (
              <Profile
                nameDetails={nameDetails}
                registrationData={item}
                callback={profileCallback}
              />
            ),
            info: (
              <Info nameDetails={nameDetails} registrationData={item} callback={infoCallback} />
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
          }[item.step],
        }}
      </Content>
    </>
  )
}

export default Registration
