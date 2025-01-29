import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CalendarSVG, Colors, Dropdown, Skeleton, Typography } from '@ensdomains/thorin'

import { CurrencyText } from '@app/components/@atoms/CurrencyText/CurrencyText'
import { useCalendarOptions } from '@app/hooks/useCalendarOptions'
import { formatExpiry } from '@app/utils/utils'

const ReminderContainer = styled(Typography)(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: ${theme.space['1']};
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    display: grid;
    padding: ${theme.space['4']};
    row-gap: ${theme.space['4']};
    column-gap: ${theme.space['4']};
    grid-template-columns: 1fr 1fr;
    border-radius: ${theme.space['2']};
    border: 1px solid #e8e8e8;

    @media (min-width: ${theme.breakpoints.sm}px) {
      grid-template-columns: 1fr;
      column-gap: 0;
    }
  `,
)

const LineItem = styled.div<{ $color?: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${theme.space['1']};
    line-height: ${theme.space['5']};
    color: ${$color ? theme.colors[$color] : theme.colors.grey};

    &:not(:last-of-type) {
      padding-bottom: ${theme.space['4']};
      border-bottom: 1px solid #e8e8e8;
    }

    @media (max-width: ${theme.breakpoints.sm}px) {
      &:not(:last-of-type) {
        border-bottom: none;
        padding-bottom: 0;
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
    }
  `,
)

export type InvoiceItem = {
  label: string
  value?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
}

type Props = {
  name: string
  expiryTitle: string
  expiryDate: Date
  items: InvoiceItem[]
}

export const Invoice = ({ name, expiryTitle, expiryDate, items }: Props) => {
  const { t } = useTranslation('common')
  const { makeEvent, options } = useCalendarOptions(`Renew ${name}`)

  return (
    <Container>
      {items.map(({ label, value, bufferPercentage }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} key={label}>
          <Typography fontVariant="small" color="grey">
            {label}
          </Typography>
          <Skeleton loading={!value}>
            <Typography color="textPrimary" data-testid={`invoice-item-${inx}-amount`}>
              <CurrencyText bufferPercentage={bufferPercentage} eth={value || 0n} currency="eth" />
            </Typography>
            <Typography
              fontVariant="small"
              color="grey"
              data-testid={`invoice-item-${inx}-amount-usd`}
            >
              <CurrencyText bufferPercentage={bufferPercentage} eth={value || 0n} currency="usd" />
            </Typography>
          </Skeleton>
        </LineItem>
      ))}

      <LineItem data-testid="invoice-item-expiry">
        <Typography fontVariant="small" color="grey">
          {expiryTitle}
        </Typography>
        <Typography color="textPrimary" data-testid="invoice-item-expiry-date">
          {formatExpiry(expiryDate)}
        </Typography>
        <Dropdown
          shortThrow
          keepMenuOnTop
          width={220}
          items={[
            ...options.map((option) => ({
              label: t(option.label, { ns: 'profile' }),
              onClick: () => window.open(option.function(makeEvent(expiryDate)), '_blank'),
            })),
          ]}
        >
          <ReminderContainer color="accentPrimary" fontVariant="small">
            <CalendarSVG width={16} height={16} /> <span>{t('action.setReminder')}</span>
          </ReminderContainer>
        </Dropdown>
      </LineItem>
    </Container>
  )
}
