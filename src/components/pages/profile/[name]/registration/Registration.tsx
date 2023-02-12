import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Dialog, Helper, Typography, mq } from '@ensdomains/thorin'

import { BaseLinkWithHistory } from '@app/components/@atoms/BaseLink'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import useResolverExists from '@app/hooks/useResolverExists'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { isLabelTooLong } from '@app/utils/utils'

import { ProfileRecord } from '../../../../../constants/profileRecordOptions'
import Complete from './steps/Complete'
import Info from './steps/Info'
import Pricing from './steps/Pricing/Pricing'
import Profile from './steps/Profile/Profile'
import Transactions from './steps/Transactions'
import { BackObj, PaymentMethod, RegistrationStepData } from './types'
import { useMoonpayRegistration } from './useMoonpayRegistration'

const ViewProfileContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    margin-bottom: -${theme.space['3']};
    padding: 0 ${theme.space['4']};

    & > a {
      transition: all 0.15s ease-in-out;

      &:hover {
        filter: brightness(1.05);
        transform: translateY(-1px);
      }
    }

    ${mq.md.min(css`
      margin-bottom: 0;
      padding: 0;
    `)}
  `,
)

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const StyledDialog = styled(Dialog)(
  () => css`
    height: 80vh;
    & > div > div {
      height: 100%;
    }
    ${mq.sm.min(css`
      max-width: 100vw;
      width: 90vw;
      height: 90vh;
      & > div {
        max-width: 90vw;
        width: 90vw;
        height: 90vh;
        padding: 0;
      }
      & > div > div {
        max-width: 90vw;
        height: 90vh;
        gap: 0;
      }
    `)}
  `,
)

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
    initiateMoonpayRegistrationMutation,
    hasMoonpayModal,
    setHasMoonpayModal,
    moonpayTransactionStatus,
  } = useMoonpayRegistration(dispatch, normalisedName, selected, item)

  const pricingCallback = ({
    years,
    reverseRecord,
    paymentMethodChoice,
  }: RegistrationStepData['pricing']) => {
    if (paymentMethodChoice === PaymentMethod.moonpay) {
      initiateMoonpayRegistrationMutation.mutate()
      return
    }
    dispatch({ name: 'setPricingData', payload: { years, reverseRecord }, selected })
    if (!item.queue.includes('profile')) {
      // if profile is not in queue, set the default profile data
      dispatch({
        name: 'setProfileData',
        payload: {
          records: [{ key: 'ETH', group: 'address', type: 'addr', value: address! }],
          clearRecords: resolverExists,
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

    // If profile is in queue and reverse record is selected, make sure that eth record is included and is set to address
    if (item.queue.includes('profile') && reverseRecord) {
      const recordsWithoutEth = item.records.filter((record) => record.key !== 'ETH')
      const newRecords: ProfileRecord[] = [
        { key: 'ETH', group: 'address', type: 'addr', value: address! },
        ...recordsWithoutEth,
      ]
      dispatch({ name: 'setProfileData', payload: { records: newRecords }, selected })
    }

    dispatch({ name: 'increaseStep', selected })
  }

  const profileCallback = ({
    records,
    resolver,
    back,
  }: RegistrationStepData['profile'] & BackObj) => {
    dispatch({ name: 'setProfileData', payload: { records, resolver }, selected })
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
        inlineHeading
      >
        {{
          header: nameDetails.expiryDate && (
            <ViewProfileContainer>
              <BaseLinkWithHistory href={`/expired-profile/${normalisedName}`} passHref>
                <a>
                  <Typography color="accent" weight="bold">
                    {t('wallet.viewProfile', { ns: 'common' })}
                  </Typography>
                </a>
              </BaseLinkWithHistory>
            </ViewProfileContainer>
          ),
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
                  moonpayTransactionStatus={moonpayTransactionStatus}
                  initiateMoonpayRegistrationMutation={initiateMoonpayRegistrationMutation}
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
              complete: (
                <Complete
                  nameDetails={nameDetails}
                  callback={onComplete}
                  isMoonpayFlow={item.isMoonpayFlow}
                />
              ),
            }[step]
          ),
        }}
      </Content>
      <StyledDialog
        open={hasMoonpayModal}
        variant="actionable"
        onDismiss={() => {
          if (moonpayTransactionStatus === 'waitingAuthorization') {
            return
          }
          setHasMoonpayModal(false)
        }}
      >
        <iframe
          title="Moonpay Checkout"
          width="100%"
          height="100%"
          style={{ borderRadius: 25 }}
          src={moonpayUrl}
          id="moonpayIframe"
        />
      </StyledDialog>
    </>
  )
}

export default Registration
