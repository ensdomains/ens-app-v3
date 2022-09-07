import { BigNumber } from 'ethers'
import styled, { css } from 'styled-components'

import { CurrencyText } from '../CurrencyText/CurrencyText'

const Container = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    background: ${theme.colors.foregroundTertiary};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    width: 90vw;
    border-radius: ${theme.space['2']};
  `,
)

const LineItem = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    line-height: ${theme.space['5']};
    color: ${theme.colors.textTertiary};
  `,
)

const Total = styled(LineItem)(
  ({ theme }) => css`
    color: ${theme.colors.text};
  `,
)

type InvoiceItem = {
  label: string
  value?: BigNumber
}

type Props = {
  items: InvoiceItem[]
  totalLabel: string
  unit?: 'eth' | 'usd'
}

export const Invoice = ({ totalLabel = 'Estimated total', unit = 'eth', items }: Props) => {
  const total = items
    .map(({ value }) => value)
    .filter((x) => !!x)
    .reduce((a, b) => a!.add(b!), BigNumber.from(0))

  return (
    <Container>
      {items.map(({ label, value }) => (
        <LineItem key={label}>
          <div>{label}</div>
          <div>
            <CurrencyText eth={value} currency={unit} />
          </div>
        </LineItem>
      ))}
      <Total>
        <div>{totalLabel}</div>
        <div>
          <CurrencyText eth={total} currency={unit} />
        </div>
      </Total>
    </Container>
  )
}
