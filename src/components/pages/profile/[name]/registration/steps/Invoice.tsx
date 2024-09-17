import styled, { css } from 'styled-components'

import { Colors, mq, Skeleton, Typography } from '@ensdomains/thorin'

import { CurrencyText } from '@app/components/@atoms/CurrencyText/CurrencyText'
import { CurrencyDisplay } from '@app/types'
import { formatExpiry } from '@app/utils/utils'

const Container = styled.div(
  ({ theme }) => css`
    display: grid;
    padding: ${theme.space['4']};
    row-gap: ${theme.space['4']};
    column-gap: ${theme.space['4']};
    grid-template-columns: 1fr 1fr;
    border-radius: ${theme.space['2']};
    border: 1px solid #e8e8e8;

    ${mq.sm.min(css`
      grid-template-columns: 1fr;
      column-gap: 0px;
    `)}
  `,
)

const LineItem = styled.div<{ $color?: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.space['1']};
    line-height: ${theme.space['5']};
    color: ${$color ? theme.colors[$color] : theme.colors.textTertiary};

    &:not(:last-of-type) {
      padding-bottom: ${theme.space['4']};
      border-bottom: 1px solid #e8e8e8;
    }

    ${mq.sm.max(css`
      &:not(:last-of-type) {
        border-bottom: none;
        padding-bottom: 0px;
      }

      &:first-of-type {
        padding-right: ${theme.space['4']};
        border-right: 1px solid #e8e8e8;
      }

      &:last-of-type {
        grid-column: span 2;
        padding-top: ${theme.space['4']};
        border-top: 1px solid #e8e8e8;
      }
    `)}
  `,
)

export type InvoiceItem = {
  label: string
  value?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
}

type Props = {
  expiryTitle: string
  expiryDate: Date
  items: InvoiceItem[]
  unit?: CurrencyDisplay
}

export const Invoice = ({ expiryTitle, expiryDate, unit = 'eth', items }: Props) => {
  return (
    <Container>
      {items.map(({ label, value, bufferPercentage }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} key={label}>
          <Typography fontVariant="small" color="textTertiary">
            {label}
          </Typography>
          <Skeleton loading={!value}>
            <Typography color="textPrimary" data-testid={`invoice-item-${inx}-amount`}>
              <CurrencyText bufferPercentage={bufferPercentage} eth={value || 0n} currency={unit} />
            </Typography>
          </Skeleton>
        </LineItem>
      ))}

      <LineItem data-testid="invoice-item-expiry">
        <Typography fontVariant="small" color="textTertiary">
          {expiryTitle}
        </Typography>
        <Typography color="textPrimary" data-testid="invoice-item-expiry-date">
          {formatExpiry(expiryDate)}
        </Typography>
      </LineItem>
    </Container>
  )
}
