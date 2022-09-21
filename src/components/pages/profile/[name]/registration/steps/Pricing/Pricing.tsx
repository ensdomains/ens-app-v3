import { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useBalance } from 'wagmi'

import { Button, Checkbox, Heading, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import FullInvoice from '../../FullInvoice'
import { RegistrationStepData } from '../../types'
import TemporaryPremium from './TemporaryPremium'

const StyledCard = styled(Card)(
  ({ theme }) => css`
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
    border: ${theme.colors.grey} solid 1px;

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
  callback: (props: RegistrationStepData['pricing']) => void
  hasPrimaryName: boolean
}

const Pricing = ({ nameDetails, callback, hasPrimaryName }: Props) => {
  const breakpoints = useBreakpoint()
  const { normalisedName, gracePeriodEndDate } = nameDetails

  const { address } = useAccount()
  const { data: balance } = useBalance({ addressOrName: address })
  const resolverAddress = useContractAddress('PublicResolver')

  const [years, setYears] = useState(1)
  const [reverseRecord, setReverseRecord] = useState(!hasPrimaryName)

  const fullEstimate = useEstimateFullRegistration({
    registration: {
      permissions: {},
      records: {
        coinTypes: [{ key: 'ETH', value: resolverAddress }],
      },
      resolver: resolverAddress,
      reverseRecord,
      years,
    },
    price: nameDetails.priceData,
  })
  const { hasPremium, premiumFee, gasPrice, yearlyFee, totalYearlyFee, estimatedGasFee } =
    fullEstimate

  const yearlyRequiredBalance = totalYearlyFee?.mul(110).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0)

  let actionButton: ReactNode

  if (!address) {
    actionButton = <ConnectButton large />
  } else if (!balance?.value || !totalRequiredBalance) {
    actionButton = (
      <Button shadowless disabled>
        Loading
      </Button>
    )
  } else if (balance?.value.lt(totalRequiredBalance)) {
    actionButton = (
      <Button shadowless disabled>
        Insufficient Balance
      </Button>
    )
  } else {
    actionButton = (
      <Button shadowless onClick={() => callback({ reverseRecord, years })}>
        Next
      </Button>
    )
  }

  return (
    <StyledCard>
      <Heading>Register {normalisedName}</Heading>
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
            message="Extending for multiple years will save money on network costs by avoiding yearly transactions."
          />
        )
      )}
      <OutlinedContainer>
        <OutlinedContainerTitle $name="title">Use as primary name</OutlinedContainerTitle>
        <CheckboxWrapper $name="checkbox">
          <Checkbox
            variant="switch"
            hideLabel
            label="Use as primary name"
            disabled={!address}
            size={breakpoints.md ? 'large' : 'medium'}
            checked={reverseRecord}
            onChange={(e) => setReverseRecord(e.target.checked)}
          />
        </CheckboxWrapper>
        <OutlinedContainerDescription $name="description">
          This links your address to this name, allowing apps to display this name as your profile
          when connected to them.
        </OutlinedContainerDescription>
      </OutlinedContainer>
      <MobileFullWidth>{actionButton}</MobileFullWidth>
    </StyledCard>
  )
}

export default Pricing
