import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import GasDisplay from '@app/components/@atoms/GasDisplay'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { Content } from '@app/layouts/Content'
import { CurrencyUnit } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Checkbox, Colors, Heading, mq, Typography } from '@ensdomains/thorin'
import Head from 'next/head'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'
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

const ConnectButtonWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    ${mq.md.min(css`
      width: ${theme.space['40']};
    `)}
  `,
)

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const Registration = ({ nameDetails, isLoading }: Props) => {
  const network = useChainId()
  const breakpoints = useBreakpoint()
  const { normalisedName, priceData, gracePeriodEndDate } = nameDetails

  const { address } = useAccount()

  const fiatUnit = 'usd'

  const [years, setYears] = useState(1)
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const currencyDisplay = currencyUnit === 'fiat' ? fiatUnit : 'eth'

  const { data: transactionData, loading: transactionDataLoading } = useEstimateTransactionCost([
    'REGISTER',
    'COMMIT',
  ])
  const { gasPrice, transactionFee } = transactionData || {}

  const yearFee = priceData?.base
  const premiumFee = priceData?.premium
  const totalYearlyFee = yearFee?.mul(years)
  const hasPremium = premiumFee?.gt(0)

  const items = [
    {
      label: `${years} year registration`,
      value: totalYearlyFee,
    },
    {
      label: 'Est. network fee',
      value: transactionFee,
    },
    ...(hasPremium
      ? [
          {
            label: 'Temporary premium',
            value: premiumFee,
            color: 'blue' as Colors,
          },
        ]
      : []),
  ]

  return (
    <>
      <Head>
        <title>Register {normalisedName}</title>
      </Head>
      <Content
        noTitle
        title={normalisedName}
        subtitle="Register"
        loading={isLoading || transactionDataLoading}
      >
        {{
          leading: breakpoints.md && <NFTWithPlaceholder name={normalisedName} network={network} />,
          trailing: (
            <StyledCard>
              <Heading>Register {normalisedName}</Heading>
              <PlusMinusControl
                minValue={1}
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
                <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
              </InvoiceContainer>
              {hasPremium && gracePeriodEndDate ? (
                <TemporaryPremium startDate={gracePeriodEndDate} name={normalisedName} />
              ) : (
                yearFee &&
                transactionFee &&
                gasPrice && (
                  <RegistrationTimeComparisonBanner
                    rentFee={yearFee}
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
                  />
                </CheckboxWrapper>
                <OutlinedContainerDescription $name="description">
                  This links your address to this name, allowing apps to display this name as your
                  profile when connected to them.
                </OutlinedContainerDescription>
              </OutlinedContainer>
              <ConnectButtonWrapper>
                <ConnectButton large />
              </ConnectButtonWrapper>
            </StyledCard>
          ),
        }}
      </Content>
    </>
  )
}

export default Registration
