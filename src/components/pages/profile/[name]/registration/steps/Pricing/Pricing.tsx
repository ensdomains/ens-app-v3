import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useBalance } from 'wagmi'

import { Button, Field, Heading, Toggle, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { childFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

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

    ${mq.md.min(css`
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
    border: ${theme.colors.border} solid 1px;

    ${mq.md.min(css`
      grid-template-areas: 'title checkbox' 'description checkbox';
    `)}
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

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  resolverExists: boolean | undefined
  callback: (props: RegistrationStepData['pricing']) => void
  hasPrimaryName: boolean
  registrationData: RegistrationReducerDataItem
}

const Pricing = ({
  nameDetails,
  callback,
  hasPrimaryName,
  registrationData,
  resolverExists,
}: Props) => {
  const { t } = useTranslation('register')

  const breakpoints = useBreakpoint()
  const { normalisedName, gracePeriodEndDate } = nameDetails

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ addressOrName: address })
  const resolverAddress = useContractAddress('PublicResolver')

  const [years, setYears] = useState(registrationData.years)
  const [reverseRecord, setReverseRecord] = useState(
    registrationData.reverseRecord || !hasPrimaryName,
  )

  const fullEstimate = useEstimateFullRegistration({
    registration: {
      // permissions: {},
      permissions: childFuseObj,
      records: [{ key: 'ETH', value: resolverAddress, type: 'addr', group: 'address' }],
      clearRecords: resolverExists,
      // permissions: childFuseObj,
      // records: {
      //   coinTypes: [{ key: 'ETH', value: resolverAddress }],
      //   clearRecords: resolverExists,
      // },
      resolver: resolverAddress,
      reverseRecord,
      years,
    },
    price: nameDetails.priceData,
  })
  const { hasPremium, premiumFee, gasPrice, yearlyFee, totalYearlyFee, estimatedGasFee } =
    fullEstimate

  const yearlyRequiredBalance = totalYearlyFee?.mul(110).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0).add(estimatedGasFee || 0)

  let actionButton: ReactNode

  if (!address) {
    actionButton = <ConnectButton large />
  } else if (!balance?.value || !totalRequiredBalance) {
    actionButton = (
      <Button data-testid="next-button" disabled>
        {t('action.loading', { ns: 'common' })}
      </Button>
    )
  } else if (balance?.value.lt(totalRequiredBalance)) {
    actionButton = (
      <Button data-testid="next-button" disabled>
        {t('steps.pricing.insufficientBalance')}
      </Button>
    )
  } else {
    actionButton = (
      <Button data-testid="next-button" onClick={() => callback({ reverseRecord, years })}>
        {t('action.next', { ns: 'common' })}
      </Button>
    )
  }

  return (
    <StyledCard>
      <Heading>{t('heading', { name: normalisedName })}</Heading>
      <PlusMinusControl
        minValue={1}
        value={years}
        onChange={(e) => {
          const newYears = parseInt(e.target.value)
          if (!Number.isNaN(newYears)) setYears(newYears)
        }}
        highlighted
      />
      <FullInvoice {...fullEstimate} />
      {hasPremium && gracePeriodEndDate ? (
        <TemporaryPremium startDate={gracePeriodEndDate} name={normalisedName} />
      ) : (
        yearlyFee &&
        estimatedGasFee &&
        gasPrice && (
          <RegistrationTimeComparisonBanner
            rentFee={yearlyFee}
            transactionFee={estimatedGasFee}
            message={t('steps.pricing.multipleYearsMessage')}
          />
        )
      )}
      <OutlinedContainer>
        <OutlinedContainerTitle $name="title">
          {t('steps.pricing.primaryName')}
        </OutlinedContainerTitle>
        <CheckboxWrapper $name="checkbox">
          <Field
            hideLabel
            label={t('steps.pricing.primaryName')}
            inline
            reverse
            disabled={!address}
          >
            {(ids) => (
              <Toggle
                {...ids?.content}
                disabled={!address}
                size={breakpoints.md ? 'large' : 'medium'}
                checked={reverseRecord}
                onChange={(e) => setReverseRecord(e.target.checked)}
                data-testid="primary-name-toggle"
              />
            )}
          </Field>
        </CheckboxWrapper>
        <OutlinedContainerDescription $name="description">
          {t('steps.pricing.primaryNameMessage')}
        </OutlinedContainerDescription>
      </OutlinedContainer>
      <MobileFullWidth>{actionButton}</MobileFullWidth>
    </StyledCard>
  )
}

export default Pricing
