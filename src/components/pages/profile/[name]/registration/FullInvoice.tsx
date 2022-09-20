import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Colors } from '@ensdomains/thorin'

import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import GasDisplay from '@app/components/@atoms/GasDisplay'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { CurrencyUnit } from '@app/types'

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

type Props = ReturnType<typeof useEstimateFullRegistration>

const FullInvoice = ({
  years,
  totalYearlyFee,
  estimatedGasFee,
  hasPremium,
  premiumFee,
  estimatedGasLoading,
  gasPrice,
}: Props) => {
  const fiatUnit = 'usd'

  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const currencyDisplay = currencyUnit === 'fiat' ? fiatUnit : 'eth'

  const invoiceItems = useMemo(
    () => [
      {
        label: `${years} year registration`,
        value: totalYearlyFee,
      },
      {
        label: 'Est. network fee',
        value: estimatedGasFee,
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
    ],
    [years, totalYearlyFee, estimatedGasFee, hasPremium, premiumFee],
  )

  if (estimatedGasLoading) return null

  return (
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
  )
}

export default FullInvoice
