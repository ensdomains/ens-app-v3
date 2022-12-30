import { BigNumber } from 'ethers'
import styled, { css } from 'styled-components'

import { Colors } from '@ensdomains/thorin'

import { CurrencyDisplay } from '@app/types'

import { CurrencyText } from '../CurrencyText/CurrencyText'

const Container = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    background: ${theme.colors.backgroundSecondary};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    width: 100%;
    border-radius: ${theme.space['2']};
  `,
)

const LineItem = styled.div<{ $color?: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    justify-content: space-between;
    line-height: ${theme.space['5']};
    color: ${$color ? theme.colors[$color] : theme.colors.textTertiary};
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
  color?: Colors
}

type Props = {
  items: InvoiceItem[]
  totalLabel: string
  unit?: CurrencyDisplay
}

export const Invoice = ({ totalLabel = 'Estimated total', unit = 'eth', items }: Props) => {
  const total = items
    .map(({ value }) => value)
    .filter((x) => !!x)
    .reduce((a, b) => a!.add(b!), BigNumber.from(0))

  return (
    <Container>
      {items.map(({ label, value, color }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
          <div>{label}</div>
          <div data-testid={`invoice-item-${inx}-amount`}>
            <CurrencyText eth={value} currency={unit} />
          </div>
        </LineItem>
      ))}
      <Total>
        <div>{totalLabel}</div>
        <div data-testid="invoice-total">
          <CurrencyText eth={total} currency={unit} />
        </div>
      </Total>
    </Container>
  )
}
