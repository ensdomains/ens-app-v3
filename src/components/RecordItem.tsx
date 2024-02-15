import { RecordItem as ThorinRecordItem } from '@ensdomains/thorin'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

const RecordItem = ({
  itemKey,
  value,
  displayValue = value,
  showLegacy,
  type,
}: {
  itemKey?: string
  value: string
  displayValue?: string
  showLegacy?: boolean
  type: 'text' | 'address' | 'contentHash' | 'abi'
}) => {
  const breakpoint = useBreakpoint()
  const keyLabel = showLegacy && itemKey ? itemKey?.replace('_LEGACY', '') : itemKey
  const keySubLabel = showLegacy ? 'LEGACY' : undefined

  return (
    <ThorinRecordItem
      size={breakpoint.sm ? 'large' : 'small'}
      value={value}
      keyLabel={keyLabel}
      keySublabel={keySubLabel}
      data-testid={
        itemKey ? `name-details-${type}-${itemKey.toLowerCase()}` : `name-details-${type}`
      }
    >
      {displayValue}
    </ThorinRecordItem>
  )
}

export default RecordItem
