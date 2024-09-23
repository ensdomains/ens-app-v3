import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousDistinct } from 'react-use'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'
import { GetBalanceData } from 'wagmi/query'

import { Button, Heading, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/gasEstimation/useEstimateRegistration'
import type {
  RegistrationDurationType,
  RegistrationPaymentMethod,
} from '@app/transaction/slices/createRegistrationFlowSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'
import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

import FullInvoice from '../../FullInvoice'
import { MoonpayTransactionStatus, PaymentMethod } from '../../types'
import {
  useMoonpayRegistration,
  type InitiateMoonpayRegistrationMutationResult,
} from '../../useMoonpayRegistration'
import { PaymentChoice } from './PaymentChoice'
import TemporaryPremium from './TemporaryPremium'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const StyledHeading = styled(Heading)(
  () => css`
    width: 100%;
    word-break: break-all;

    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
      word-break: normal;
    }
  `,
)

const gridAreaStyle = ({ $name }: { $name: string }) => css`
  grid-area: ${$name};
`

export type ActionButtonProps = {
  address?: Address
  moonpayTransactionStatus?: MoonpayTransactionStatus
  callback: () => void
  paymentMethodChoice: RegistrationPaymentMethod
  initiateMoonpayRegistrationMutation: InitiateMoonpayRegistrationMutationResult
  balance: GetBalanceData | undefined
  totalRequiredBalance?: bigint
}

export const ActionButton = (props: ActionButtonProps) => {
  const { t } = useTranslation('register')

  return match(props)
    .with({ address: P.nullish }, () => <ConnectButton large />)
    .with({ moonpayTransactionStatus: 'pending' }, () => (
      <Button data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </Button>
    ))
    .with({ moonpayTransactionStatus: 'failed', paymentMethodChoice: 'moonpay' }, () => (
      <Button data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </Button>
    ))
    .with(
      { paymentMethodChoice: 'moonpay' },
      ({ initiateMoonpayRegistrationMutation, callback, paymentMethodChoice }) => (
        <Button
          loading={initiateMoonpayRegistrationMutation.isPending}
          data-testid="next-button"
          onClick={() => callback()}
          disabled={!paymentMethodChoice || initiateMoonpayRegistrationMutation.isPending}
        >
          {t('action.next', { ns: 'common' })}
        </Button>
      ),
    )
    .with(
      P.when((_props) => typeof _props.balance?.value !== 'bigint' || !_props.totalRequiredBalance),
      () => (
        <Button data-testid="next-button" disabled>
          {t('loading', { ns: 'common' })}
        </Button>
      ),
    )
    .with(
      P.when(
        (_props) =>
          _props.totalRequiredBalance &&
          typeof _props.balance?.value === 'bigint' &&
          _props.balance.value < _props.totalRequiredBalance &&
          _props.paymentMethodChoice === PaymentMethod.ethereum,
      ),
      () => (
        <Button data-testid="next-button" disabled>
          {t('steps.pricing.insufficientBalance')}
        </Button>
      ),
    )
    .otherwise(({ callback, paymentMethodChoice }) => (
      <Button data-testid="next-button" onClick={() => callback()} disabled={!paymentMethodChoice}>
        {t('action.next', { ns: 'common' })}
      </Button>
    ))
}

export type PricingProps = {
  name: string
  gracePeriodEndDate: Date | undefined
  beautifiedName: string

  resolverExists: boolean | undefined
  isPrimaryLoading: boolean
  hasPrimaryName: boolean
  moonpayTransactionStatus?: MoonpayTransactionStatus
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
}

const minSeconds = 28 * ONE_DAY

const Pricing = ({
  name,
  gracePeriodEndDate,
  beautifiedName,
  isPrimaryLoading,
  hasPrimaryName,
  resolverExists,
  moonpayTransactionStatus,
  initiateMoonpayRegistrationMutation,
}: PricingProps) => {
  const { t } = useTranslation('register')

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ address })
  const resolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const existingRegistrationData = useTransactionManager((s) =>
    s.getCurrentRegistrationFlowOrDefault(name),
  )
  const onRegistrationPricingStepCompleted = useTransactionManager(
    (s) => s.onRegistrationPricingStepCompleted,
  )

  const [seconds, setSeconds] = useState(() => existingRegistrationData.seconds ?? ONE_YEAR)
  const [durationType, setDurationType] = useState<RegistrationDurationType>(
    existingRegistrationData.durationType ?? 'years',
  )

  const [reverseRecord, setReverseRecord] = useState(() =>
    existingRegistrationData.isStarted ? existingRegistrationData.reverseRecord : !hasPrimaryName,
  )

  const hasPendingMoonpayTransaction = moonpayTransactionStatus === 'pending'
  const hasFailedMoonpayTransaction = moonpayTransactionStatus === 'failed'

  const previousMoonpayTransactionStatus = usePrevious(moonpayTransactionStatus)

  const [paymentMethodChoice, setPaymentMethodChoice] = useState<RegistrationPaymentMethod>(
    hasPendingMoonpayTransaction ? 'moonpay' : 'ethereum',
  )

  const callback = useCallback(() => {
    onRegistrationPricingStepCompleted(name, {
      durationType,
      initiateMoonpayRegistrationMutation,
      paymentMethodChoice,
      resolverExists: !!resolverExists,
      reverseRecord,
      seconds,
    })
  }, [
    onRegistrationPricingStepCompleted,
    name,
    durationType,
    initiateMoonpayRegistrationMutation,
    paymentMethodChoice,
    resolverExists,
    reverseRecord,
    seconds,
  ])

  // Keep radio button choice up to date
  useEffect(() => {
    if (moonpayTransactionStatus) {
      setPaymentMethodChoice(
        hasPendingMoonpayTransaction || hasFailedMoonpayTransaction
          ? PaymentMethod.moonpay
          : PaymentMethod.ethereum,
      )
    }
  }, [
    hasFailedMoonpayTransaction,
    hasPendingMoonpayTransaction,
    moonpayTransactionStatus,
    previousMoonpayTransactionStatus,
    setPaymentMethodChoice,
  ])

  const fullEstimate = useEstimateFullRegistration({
    name,
    registrationData: {
      ...existingRegistrationData,
      reverseRecord,
      seconds,
      records: [{ key: 'ETH', value: resolverAddress, type: 'addr', group: 'address' }],
      clearRecords: resolverExists,
      resolverAddress,
    },
  })

  const { hasPremium, premiumFee, gasPrice, yearlyFee, totalDurationBasedFee, estimatedGasFee } =
    fullEstimate
  const durationRequiredBalance = totalDurationBasedFee ? (totalDurationBasedFee * 110n) / 100n : 0n
  const totalRequiredBalance = durationRequiredBalance
    ? durationRequiredBalance + (premiumFee || 0n) + (estimatedGasFee || 0n)
    : 0n

  const previousYearlyFee = usePreviousDistinct(yearlyFee) || 0n

  const unsafeDisplayYearlyFee = yearlyFee === 0n ? previousYearlyFee : yearlyFee

  const showPaymentChoice = !isPrimaryLoading && address

  const previousEstimatedGasFee = usePreviousDistinct(estimatedGasFee) || 0n

  const unsafeDisplayEstimatedGasFee =
    estimatedGasFee === 0n ? previousEstimatedGasFee : estimatedGasFee

  return (
    <StyledCard>
      <StyledHeading>{t('heading', { name: beautifiedName })}</StyledHeading>
      <DateSelection
        {...{ seconds, setSeconds, minSeconds, durationType }}
        onChangeDurationType={setDurationType}
      />
      <FullInvoice {...fullEstimate} />
      {hasPremium && gracePeriodEndDate ? (
        <TemporaryPremium startDate={gracePeriodEndDate} name={name} />
      ) : (
        !!unsafeDisplayYearlyFee &&
        !!unsafeDisplayEstimatedGasFee &&
        !!gasPrice && (
          <RegistrationTimeComparisonBanner
            yearlyFee={unsafeDisplayYearlyFee}
            transactionFee={unsafeDisplayEstimatedGasFee}
            message={t('steps.pricing.multipleYearsMessage')}
          />
        )
      )}
      {showPaymentChoice && (
        <PaymentChoice
          {...{
            paymentMethodChoice,
            setPaymentMethodChoice,
            hasEnoughEth: true,
            moonpayTransactionStatus,
            hasPrimaryName,
            address,
            reverseRecord,
            setReverseRecord,
            started: existingRegistrationData.isStarted,
          }}
        />
      )}
      <MobileFullWidth>
        <ActionButton
          {...{
            address,
            hasPendingMoonpayTransaction,
            hasFailedMoonpayTransaction,
            paymentMethodChoice,
            reverseRecord,
            callback,
            initiateMoonpayRegistrationMutation,
            seconds,
            balance,
            totalRequiredBalance,
            durationType,
          }}
        />
      </MobileFullWidth>
    </StyledCard>
  )
}

export default Pricing
