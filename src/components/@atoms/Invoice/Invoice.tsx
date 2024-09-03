import styled, { css } from 'styled-components'

import { Colors, Skeleton } from '@ensdomains/thorin'

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
    color: ${$color ? theme.colors[$color] : theme.colors.grey};
  `,
)

const Total = styled(LineItem)(
  ({ theme }) => css`
    color: ${theme.colors.text};
  `,
)

export type InvoiceItem = {
  label: string
  value?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  color?: Colors
}

type Props = {
  items: InvoiceItem[]
  totalLabel: string
  unit?: CurrencyDisplay
}

export const Invoice = ({ totalLabel = 'Estimated total', unit = 'eth', items }: Props) => {
  const filteredItems = items
    .map(({ value, bufferPercentage }) =>
      value && unit === 'eth' && bufferPercentage ? (value * bufferPercentage) / 100n : value,
    )
    .filter((x): x is bigint => !!x)
  const total = filteredItems.reduce((a, b) => a + b, 0n)
  const hasEmptyItems = filteredItems.length !== items.length

  return (
    <Container>
      {items.map(({ label, value, bufferPercentage, color }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
          <div>{label}</div>
          <Skeleton loading={!value}>
            <div data-testid={`invoice-item-${inx}-amount`}>
              <CurrencyText bufferPercentage={bufferPercentage} eth={value || 0n} currency={unit} />
            </div>
          </Skeleton>
        </LineItem>
      ))}
      <Total>
        <div>{totalLabel}</div>
        <Skeleton loading={hasEmptyItems}>
          <div data-testid="invoice-total">
            <CurrencyText eth={hasEmptyItems ? 0n : total} currency={unit} />
          </div>
        </Skeleton>
      </Total>
    </Container>
  )
}
