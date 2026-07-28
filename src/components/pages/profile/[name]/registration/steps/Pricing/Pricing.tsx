import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousDistinct } from 'react-use'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'
import { GetBalanceData } from 'wagmi/query'

import { Button, Field, Heading, Toggle, Typography } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { ConnectButton } from '@app/components/@molecules/ConnectButton/ConnectButton'
import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { Card } from '@app/components/Card'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/gasEstimation/useEstimateRegistration'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

import FullInvoice from '../../FullInvoice'
import { RegistrationReducerDataItem, RegistrationStepData } from '../../types'
import TemporaryPremium from './TemporaryPremium'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
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

    @media (min-width: ${theme.breakpoints.sm}px) {
      grid-template-areas: 'title checkbox' 'description checkbox';
    }
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

const ReverseRecordSelection = ({
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (reverseRecord: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')

  return (
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
  )
}

export type ActionButtonProps = {
  address?: Address
  reverseRecord: boolean
  callback: (props: RegistrationStepData['pricing']) => void
  seconds: number
  balance: GetBalanceData | undefined
  totalRequiredBalance?: bigint
  estimatedTotal?: bigint
  ethPrice?: bigint
  durationType: 'date' | 'years'
}

export const ActionButton = (props: ActionButtonProps) => {
  const { t } = useTranslation('register')

  return match(props)
    .with({ address: P.nullish }, () => <ConnectButton large />)
    .with(
      P.when(
        (_props) =>
          typeof _props.balance?.value !== 'bigint' ||
          !_props.totalRequiredBalance ||
          !_props.ethPrice,
      ),
      () => (
        <Button data-testid="next-button" disabled>
          {t('loading', { ns: 'common' })}
        </Button>
      ),
    )
    .with(
      P.when(
        (_props) =>
          !!_props.totalRequiredBalance &&
          typeof _props.balance?.value === 'bigint' &&
          _props.balance.value < _props.totalRequiredBalance,
      ),
      () => (
        <Button data-testid="next-button" disabled>
          {t('steps.pricing.insufficientBalance')}
        </Button>
      ),
    )
    .otherwise(({ reverseRecord, seconds, estimatedTotal, ethPrice, durationType, callback }) => (
      <Button
        data-testid="next-button"
        onClick={() =>
          callback({
            reverseRecord,
            seconds,
            estimatedTotal,
            ethPrice,
            durationType,
          })
        }
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
}: PricingProps) => {
  const { t } = useTranslation('register')

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ address })
  const resolverAddress = useContractAddress({ contract: 'ensPublicResolver' })
  const { data: ethPrice } = useEthPrice()

  const [seconds, setSeconds] = useState(() => registrationData.seconds ?? ONE_YEAR)
  const [durationType, setDurationType] = useState<'date' | 'years'>(
    registrationData.durationType ?? 'years',
  )

  const [reverseRecord, setReverseRecord] = useState(() =>
    registrationData.started ? registrationData.reverseRecord : !hasPrimaryName,
  )

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
  const estimatedTotal =
    (totalDurationBasedFee || 0n) + (premiumFee || 0n) + (estimatedGasFee || 0n)

  const previousYearlyFee = usePreviousDistinct(yearlyFee) || 0n

  const unsafeDisplayYearlyFee = yearlyFee === 0n ? previousYearlyFee : yearlyFee

  const showReverseRecord = !isPrimaryLoading && address

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
      {showReverseRecord && (
        <ReverseRecordSelection
          {...{
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
            reverseRecord,
            callback,
            seconds,
            balance,
            totalRequiredBalance,
            estimatedTotal,
            ethPrice,
            durationType,
          }}
        />
      </MobileFullWidth>
    </StyledCard>
  )
}

export default Pricing
