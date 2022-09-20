import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import { Content } from '@app/layouts/Content'

import Complete from './steps/Complete'
import Info from './steps/Info'
import Pricing from './steps/Pricing/Pricing'
import Profile from './steps/Profile/Profile'
import Transactions from './steps/Transactions'
import { RegistrationStepData } from './types'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const Registration = ({ nameDetails, isLoading }: Props) => {
  const router = useRouter()
  const { address } = useAccount()
  const selected = { name: nameDetails.normalisedName, address: address! }
  const { normalisedName } = nameDetails

  const { dispatch, item } = useRegistrationReducer(selected)

  const onPricingNext = ({ years, reverseRecord }: RegistrationStepData['pricing']) => {
    dispatch({ name: 'setPricingData', payload: { years, reverseRecord }, selected })
    dispatch({ name: 'setStep', payload: 'profile', selected })
  }

  const onProfileNext = ({ records, resolver, permissions }: RegistrationStepData['profile']) => {
    dispatch({ name: 'setProfileData', payload: { records, resolver, permissions }, selected })
    dispatch({ name: 'setStep', payload: 'info', selected })
  }

  const onInfoNext = () => {
    dispatch({ name: 'setStep', payload: 'transactions', selected })
  }

  const onTransactionsNext = () => {
    dispatch({ name: 'setStep', payload: 'complete', selected })
  }

  const onCompleteNext = (toProfile: boolean) => {
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
        loading={isLoading}
        singleColumnContent
      >
        {{
          trailing: {
            pricing: <Pricing nameDetails={nameDetails} callback={onPricingNext} />,
            profile: <Profile nameDetails={nameDetails} callback={onProfileNext} />,
            info: <Info nameDetails={nameDetails} registrationData={item} callback={onInfoNext} />,
            transactions: (
              <Transactions
                nameDetails={nameDetails}
                registrationData={item}
                callback={onTransactionsNext}
              />
            ),
            complete: <Complete nameDetails={nameDetails} callback={onCompleteNext} />,
          }[item.step],
        }}
      </Content>
    </>
  )
}

export default Registration
