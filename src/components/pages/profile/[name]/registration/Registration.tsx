import Head from 'next/head'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { useAccount, useChainId } from 'wagmi'

import { Dialog, Helper, Typography } from '@ensdomains/thorin'

import { BaseLinkWithHistory } from '@app/components/@atoms/BaseLink'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationReducer from '@app/hooks/useRegistrationReducer'
import { useResolverExists } from '@app/hooks/useResolverExists'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { sendEvent } from '@app/utils/analytics/events'
import { isLabelTooLong, secondsToYears } from '@app/utils/utils'

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

    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-bottom: 0;
      padding: 0;
    }
  `,
)

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const StyledInnerDialog = styled(InnerDialog)(
  ({ theme }) => css`
    height: 85vh;
    max-height: 85vh;
    margin: -${theme.space['4']};
    width: calc(100% + 2 * ${theme.space['4']});
    gap: 0;
    overflow: hidden;
    border-top-left-radius: ${theme.radii['3xLarge']};
    border-top-right-radius: ${theme.radii['3xLarge']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      height: 90vh;
      max-height: 720px;
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
      margin: -${theme.space['6']};
      border-bottom-left-radius: ${theme.radii['3xLarge']};
      border-bottom-right-radius: ${theme.radii['3xLarge']};
    }
  `,
)

const MoonPayHeader = styled.div(
  ({ theme }) => css`
    width: 100%;
    background-color: ${theme.colors.greySurface};
    color: ${theme.colors.greyPrimary};
    padding: ${theme.space['4']};
  `,
)

const MoonPayIFrame = styled.iframe(
  ({ theme }) => css`
    max-width: 590px; /* Prevent moonpay iframe from going into modal mode */
    padding: ${theme.space['2']};
    background-color: #fff;

    @media (prefers-color-scheme: dark) {
      background-color: #1c1c1e;
    }
  `,
)

const Registration = ({ nameDetails, isLoading }: Props) => {
  const { t } = useTranslation('register')

  const router = useRouterWithHistory()
  const chainId = useChainId()
  const { address } = useAccount()
  const primary = usePrimaryName({ address })
  const selected = useMemo(
    () => ({ name: nameDetails.normalisedName, address: address!, chainId }),
    [address, chainId, nameDetails.normalisedName],
  )
  const { normalisedName, beautifiedName = '' } = nameDetails
  const defaultResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })
  const { data: resolverExists, isLoading: resolverExistsLoading } = useResolverExists({
    address: defaultResolverAddress,
    name: normalisedName,
  })

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
    seconds,
    reverseRecord,
    paymentMethodChoice,
    estimatedTotal,
    ethPrice,
    durationType,
  }: RegistrationStepData['pricing']) => {
    sendEvent('register:pricing', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ens_name: normalisedName,
      duration: seconds,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      estimated_total: estimatedTotal ?? 0n,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      eth_price: ethPrice ?? 0n,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_method: paymentMethodChoice,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      add_reverse_record: reverseRecord,
    })

    if (paymentMethodChoice === PaymentMethod.moonpay) {
      initiateMoonpayRegistrationMutation.mutate(secondsToYears(seconds))
      return
    }
    dispatch({
      name: 'setPricingData',
      payload: { seconds, reverseRecord, durationType },
      selected,
    })
    if (!item.queue.includes('profile')) {
      // if profile is not in queue, set the default profile data
      dispatch({
        name: 'setProfileData',
        payload: {
          records: [{ key: 'eth', group: 'address', type: 'addr', value: address! }],
          clearRecords: resolverExists,
          resolverAddress: defaultResolverAddress,
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
      const recordsWithoutEth = item.records.filter((record) => record.key !== 'eth')
      const newRecords: ProfileRecord[] = [
        { key: 'eth', group: 'address', type: 'addr', value: address! },
        ...recordsWithoutEth,
      ]
      dispatch({ name: 'setProfileData', payload: { records: newRecords }, selected })
    }

    dispatch({ name: 'increaseStep', selected })
  }

  const profileCallback = ({
    records,
    resolverAddress,
    back,
  }: RegistrationStepData['profile'] & BackObj) => {
    if (!back) {
      sendEvent('register:profile', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: normalisedName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        profile_records: records,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        resolver_address: resolverAddress,
      })
    }

    dispatch({ name: 'setProfileData', payload: { records, resolverAddress }, selected })
    dispatch({ name: back ? 'decreaseStep' : 'increaseStep', selected })
  }

  const genericCallback = ({ back }: BackObj) => {
    dispatch({ name: back ? 'decreaseStep' : 'increaseStep', selected })
  }

  const infoCallback = ({ back }: BackObj) => {
    if (!back) {
      sendEvent('register:info', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: normalisedName,
      })
    }

    genericCallback({ back })
  }

  const transactionsCallback = useCallback(
    ({ back, resetSecret }: BackObj & { resetSecret?: boolean }) => {
      if (resetSecret) {
        dispatch({ name: 'resetSecret', selected })
      }
      genericCallback({ back })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  )

  const infoProfileCallback = () => {
    sendEvent('register:back', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ens_name: normalisedName,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      from_step: 'info',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      to_step: 'profile',
    })
    dispatch({
      name: 'setQueue',
      payload: ['pricing', 'profile', 'info', 'transactions', 'complete'],
      selected,
    })
  }

  /**
   * This is called when the user starts the commit transaction
   */
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
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, step, selected, router.asPath])

  const onDismissMoonpayModal = () => {
    if (moonpayTransactionStatus === 'waitingAuthorization') {
      return
    }
    setHasMoonpayModal(false)
  }

  return (
    <>
      <Head>
        <title>{t('title', { name: beautifiedName })}</title>
      </Head>
      <Content
        noTitle
        title={beautifiedName}
        hideHeading={step === 'complete'}
        loading={labelTooLong ? false : isLoading || primary.isLoading || resolverExistsLoading}
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
          trailing: match([labelTooLong, step])
            .with([true, P._], () => <Helper alert="error">{t('error.nameTooLong')}</Helper>)
            .with([false, 'pricing'], () => (
              <Pricing
                name={normalisedName}
                beautifiedName={beautifiedName}
                gracePeriodEndDate={nameDetails.gracePeriodEndDate}
                resolverExists={resolverExists}
                callback={pricingCallback}
                isPrimaryLoading={primary.isLoading}
                hasPrimaryName={!!primary.data?.name}
                registrationData={item}
                moonpayTransactionStatus={moonpayTransactionStatus}
                initiateMoonpayRegistrationMutation={initiateMoonpayRegistrationMutation}
              />
            ))
            .with([false, 'profile'], () => (
              <Profile
                name={normalisedName}
                resolverExists={resolverExists}
                registrationData={item}
                callback={profileCallback}
              />
            ))
            .with([false, 'info'], () => (
              <Info
                name={normalisedName}
                registrationData={item}
                callback={infoCallback}
                onProfileClick={infoProfileCallback}
              />
            ))
            .with([false, 'transactions'], () => (
              <Transactions
                name={normalisedName}
                registrationData={item}
                onStart={onStart}
                callback={transactionsCallback}
              />
            ))
            .with([false, 'complete'], () => (
              <Complete
                name={normalisedName}
                beautifiedName={beautifiedName}
                callback={onComplete}
                registrationData={item}
                isMoonpayFlow={item.isMoonpayFlow}
              />
            ))
            .exhaustive(),
        }}
      </Content>
      <Dialog
        open={hasMoonpayModal}
        variant="blank"
        onDismiss={onDismissMoonpayModal}
        onClose={onDismissMoonpayModal}
      >
        <StyledInnerDialog>
          <MoonPayHeader>
            <Typography fontVariant="bodyBold" color="grey">
              {t('steps.info.moonpayModalHeader')}
            </Typography>
          </MoonPayHeader>
          <MoonPayIFrame
            title="Moonpay Checkout"
            width="100%"
            height="100%"
            src={moonpayUrl}
            id="moonpayIframe"
          />
        </StyledInnerDialog>
      </Dialog>
    </>
  )
}

export default Registration
