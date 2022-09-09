import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import GasDisplay from '@app/components/@atoms/GasDisplay'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { CurrencyUnit } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button, Checkbox, Heading, mq, Typography } from '@ensdomains/thorin'
import { BigNumber } from 'ethers'
import { ComponentProps, ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useBalance } from 'wagmi'
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

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const InvoiceContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['2']};
    width: 100%;
  `,
)

const OutlinedContainer = styled.div(
  ({ theme }) => css`
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
  transactionData: ReturnType<typeof useEstimateTransactionCost>['data']
  hasPremium: boolean | undefined
  yearlyFee: BigNumber | undefined
  premiumFee: BigNumber | undefined
  callback: (props: RegistrationStepData['pricing']) => void
  makeInvoiceItems: (years: number) => ComponentProps<typeof Invoice>['items']
}

const Pricing = ({
  nameDetails,
  transactionData,
  hasPremium,
  premiumFee,
  yearlyFee,
  callback,
  makeInvoiceItems,
}: Props) => {
  const breakpoints = useBreakpoint()
  const { normalisedName, gracePeriodEndDate } = nameDetails

  const { address } = useAccount()
  const { data: balance } = useBalance({ addressOrName: address })

  const fiatUnit = 'usd'

  const [years, setYears] = useState(1)
  const [makePrimary, setMakePrimary] = useState(false)

  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const currencyDisplay = currencyUnit === 'fiat' ? fiatUnit : 'eth'

  const { gasPrice, transactionFee } = transactionData || {}

  const totalYearlyFee = yearlyFee?.mul(years)
  const yearlyRequiredBalance = totalYearlyFee?.mul(110).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0)

  const invoiceItems = makeInvoiceItems(years)

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
      <Button shadowless onClick={() => callback({ makePrimary, years })}>
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
      <InvoiceContainer>
        <OptionBar>
          <GasDisplay gasPrice={gasPrice} />
          <CurrencySwitch
            value={currencyUnit}
            onChange={(unit) => setCurrencyUnit(unit)}
            fiat={fiatUnit}
          />
        </OptionBar>
        <Invoice items={invoiceItems} unit={currencyDisplay} totalLabel="Estimated total" />
      </InvoiceContainer>
      {hasPremium && gracePeriodEndDate ? (
        <TemporaryPremium startDate={gracePeriodEndDate} name={normalisedName} />
      ) : (
        yearlyFee &&
        transactionFee &&
        gasPrice && (
          <RegistrationTimeComparisonBanner
            rentFee={yearlyFee}
            transactionFee={transactionFee}
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
            checked={makePrimary}
            onChange={(e) => setMakePrimary(e.target.checked)}
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
