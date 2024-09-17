import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousDistinct } from 'react-use'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'
import { GetBalanceData } from 'wagmi/query'

import {
  Button,
  Field,
  Heading,
  Helper,
  mq,
  RadioButton,
  RadioButtonGroup,
  Toggle,
  Typography,
} from '@ensdomains/thorin'

import MoonpayLogo from '@app/assets/MoonpayLogo.svg'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Spacer } from '@app/components/@atoms/Spacer'
import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/gasEstimation/useEstimateRegistration'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

import FullInvoice from '../../FullInvoice'
import {
  MoonpayTransactionStatus,
  PaymentMethod,
  RegistrationReducerDataItem,
  RegistrationStepData,
} from '../../types'
import { useMoonpayRegistration } from '../../useMoonpayRegistration'
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

const OutlinedContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: grid;
    align-items: center;
    grid-template-areas: 'title checkbox' 'description description';
    gap: ${theme.space['2']};

    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    background: ${theme.colors.backgroundSecondary};

    ${mq.sm.min(css`
      grid-template-areas: 'title checkbox' 'description checkbox';
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

const moonpayInfoItems = Array.from({ length: 2 }, (_, i) => `steps.info.moonpayItems.${i}`)

const PaymentChoiceContainer = styled.div`
  width: 100%;
`

const StyledRadioButtonGroup = styled(RadioButtonGroup)(
  ({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    gap: 0;
  `,
)

const StyledRadioButton = styled(RadioButton)``

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    &:last-child {
      border-top: 1px solid ${theme.colors.border};
    }
  `,
)

const StyledTitle = styled(Typography)`
  margin-left: 15px;
`

const RadioLabel = styled(Typography)(
  ({ theme }) => css`
    margin-right: 10px;
    color: ${theme.colors.text};
  `,
)

const MoonpayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      flex-direction: row;
      align-items: stretch;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
)

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CheckboxWrapper = styled.div(
  () => css`
    width: 100%;
  `,
  gridAreaStyle,
)

const OutlinedContainerDescription = styled(Typography)(gridAreaStyle)

const OutlinedContainerTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    font-weight: ${theme.fontWeights.bold};
    white-space: nowrap;
  `,
  gridAreaStyle,
)

const EthInnerCheckbox = ({
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (val: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')
  const breakpoints = useBreakpoint()

  useEffect(() => {
    if (!started) {
      setReverseRecord(!hasPrimaryName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setReverseRecord])

  return (
    <CheckboxWrapper $name="checkbox">
      <Field hideLabel label={t('steps.pricing.primaryName')} inline reverse disabled={!address}>
        {(ids) => (
          <Toggle
            {...ids?.content}
            disabled={!address}
            size={breakpoints.sm ? 'large' : 'medium'}
            checked={reverseRecord}
            onChange={(e) => {
              e.stopPropagation()
              setReverseRecord(e.target.checked)
            }}
            data-testid="primary-name-toggle"
          />
        )}
      </Field>
    </CheckboxWrapper>
  )
}

const PaymentChoice = ({
  paymentMethodChoice,
  setPaymentMethodChoice,
  hasEnoughEth,
  hasPendingMoonpayTransaction,
  hasFailedMoonpayTransaction,
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  paymentMethodChoice: PaymentMethod
  setPaymentMethodChoice: Dispatch<SetStateAction<PaymentMethod>>
  hasEnoughEth: boolean
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (reverseRecord: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')

  return (
    <PaymentChoiceContainer>
      <StyledTitle color="textTertiary" weight="bold">
        {t('steps.info.paymentMethod')}
      </StyledTitle>
      <Spacer $height="2" />
      <StyledRadioButtonGroup
        value={paymentMethodChoice}
        onChange={(e) => setPaymentMethodChoice(e.target.value as PaymentMethod)}
      >
        <RadioButtonContainer>
          <StyledRadioButton
            data-testid="payment-choice-ethereum"
            label={<RadioLabel>{t('steps.info.ethereum')}</RadioLabel>}
            name="RadioButtonGroup"
            value={PaymentMethod.ethereum}
            disabled={hasPendingMoonpayTransaction}
            checked={paymentMethodChoice === PaymentMethod.ethereum || undefined}
          />
          {paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <Helper type="warning" alignment="horizontal">
                {t('steps.info.notEnoughEth')}
              </Helper>
              <Spacer $height="2" />
            </>
          )}
          {paymentMethodChoice === PaymentMethod.ethereum && hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <OutlinedContainer>
                <OutlinedContainerTitle $name="title">
                  {t('steps.pricing.primaryName')}
                </OutlinedContainerTitle>
                <EthInnerCheckbox
                  {...{ address, hasPrimaryName, reverseRecord, setReverseRecord, started }}
                />
                <OutlinedContainerDescription $name="description">
                  {t('steps.pricing.primaryNameMessage')}
                </OutlinedContainerDescription>
              </OutlinedContainer>
              <Spacer $height="2" />
            </>
          )}
        </RadioButtonContainer>
        <RadioButtonContainer>
          <StyledRadioButton
            label={
              <LabelContainer>
                <RadioLabel>{t('steps.info.creditOrDebit')}</RadioLabel>
                <Typography color="textTertiary" weight="light">
                  ({t('steps.info.additionalFee')})
                </Typography>
              </LabelContainer>
            }
            name="RadioButtonGroup"
            value={PaymentMethod.moonpay}
            checked={paymentMethodChoice === PaymentMethod.moonpay || undefined}
          />
          {paymentMethodChoice === PaymentMethod.moonpay && (
            <>
              <Spacer $height="4" />
              <InfoItems>
                {moonpayInfoItems.map((item, idx) => (
                  <InfoItem key={item}>
                    <Typography>{idx + 1}</Typography>
                    <Typography>{t(item)}</Typography>
                  </InfoItem>
                ))}
              </InfoItems>
              <Spacer $height="4" />
              {hasFailedMoonpayTransaction && (
                <Helper type="error">{t('steps.info.failedMoonpayTransaction')}</Helper>
              )}
              <Spacer $height="4" />
              <MoonpayContainer>
                {t('steps.info.poweredBy')}
                <MoonpayLogo />
              </MoonpayContainer>
            </>
          )}
        </RadioButtonContainer>
      </StyledRadioButtonGroup>
    </PaymentChoiceContainer>
  )
}

export type ActionButtonProps = {
  address?: Address
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  paymentMethodChoice: PaymentMethod | ''
  reverseRecord: boolean
  callback: (props: RegistrationStepData['pricing']) => void
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
  seconds: number
  balance: GetBalanceData | undefined
  totalRequiredBalance?: bigint
  durationType: 'date' | 'years'
}

export const ActionButton = (props: ActionButtonProps) => {
  const { t } = useTranslation('register')

  return match(props)
    .with({ address: P.nullish }, () => <ConnectButton large />)
    .with({ hasPendingMoonpayTransaction: true }, () => (
      <Button data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </Button>
    ))
    .with({ hasFailedMoonpayTransaction: true, paymentMethodChoice: PaymentMethod.moonpay }, () => (
      <Button data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </Button>
    ))
    .with(
      { paymentMethodChoice: PaymentMethod.moonpay },
      ({
        initiateMoonpayRegistrationMutation,
        reverseRecord,
        seconds,
        paymentMethodChoice,
        durationType,
        callback,
      }) => (
        <Button
          loading={initiateMoonpayRegistrationMutation.isPending}
          data-testid="next-button"
          onClick={() => callback({ reverseRecord, seconds, paymentMethodChoice, durationType })}
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
    .otherwise(({ reverseRecord, seconds, paymentMethodChoice, durationType, callback }) => (
      <Button
        data-testid="next-button"
        onClick={() => callback({ reverseRecord, seconds, paymentMethodChoice, durationType })}
        disabled={!paymentMethodChoice}
      >
        {t('action.next', { ns: 'common' })}
      </Button>
    ))
}

export type PricingProps = {
  name: string
  gracePeriodEndDate: Date | undefined
  beautifiedName: string

  resolverExists: boolean | undefined
  callback: (props: RegistrationStepData['pricing']) => void
  isPrimaryLoading: boolean
  hasPrimaryName: boolean
  registrationData: RegistrationReducerDataItem
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
  callback,
  isPrimaryLoading,
  hasPrimaryName,
  registrationData,
  resolverExists,
  moonpayTransactionStatus,
  initiateMoonpayRegistrationMutation,
}: PricingProps) => {
  const { t } = useTranslation('register')

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ address })
  const resolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const [seconds, setSeconds] = useState(() => registrationData.seconds ?? ONE_YEAR)
  const [durationType, setDurationType] = useState<'date' | 'years'>(
    registrationData.durationType ?? 'years',
  )

  const [reverseRecord, setReverseRecord] = useState(() =>
    registrationData.started ? registrationData.reverseRecord : !hasPrimaryName,
  )

  const hasPendingMoonpayTransaction = moonpayTransactionStatus === 'pending'
  const hasFailedMoonpayTransaction = moonpayTransactionStatus === 'failed'

  const previousMoonpayTransactionStatus = usePrevious(moonpayTransactionStatus)

  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethod>(
    hasPendingMoonpayTransaction ? PaymentMethod.moonpay : PaymentMethod.ethereum,
  )

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
      ...registrationData,
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
            hasPendingMoonpayTransaction,
            hasFailedMoonpayTransaction,
            hasPrimaryName,
            address,
            reverseRecord,
            setReverseRecord,
            started: registrationData.started,
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
