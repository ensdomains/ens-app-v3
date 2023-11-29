import { Box, Skeleton } from '@ensdomains/thorin'
import { Colors } from '@ensdomains/thorin2'

import { CurrencyDisplay } from '@app/types'

import { CurrencyText } from '../CurrencyText/CurrencyText'

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
    <Box
      padding="$4"
      backgroundColor="$backgroundSecondary"
      display="flex"
      flexDirection="column"
      gap="$2"
      width="$full"
      borderRadius="$large"
    >
      {items.map(({ label, value, bufferPercentage, color }, inx) => (
        <Box
          data-testid={`invoice-item-${inx}`}
          key={label}
          display="flex"
          justifyContent="space-between"
          lineHeight="$small"
          color={color ? `$${color}` : '$textSecondary'}
        >
          <div>{label}</div>
          <Skeleton loading={!value}>
            <div data-testid={`invoice-item-${inx}-amount`}>
              <CurrencyText bufferPercentage={bufferPercentage} eth={value || 0n} currency={unit} />
            </div>
          </Skeleton>
        </Box>
      ))}
      <Box display="flex" justifyContent="space-between" lineHeight="$small" color="$text">
        <div>{totalLabel}</div>
        <Skeleton loading={hasEmptyItems}>
          <div data-testid="invoice-total">
            <CurrencyText eth={hasEmptyItems ? 0n : total} currency={unit} />
          </div>
        </Skeleton>
      </Box>
    </Box>
  )
}
