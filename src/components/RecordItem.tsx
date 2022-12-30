import { RecordItem as ThorinRecordItem } from '@ensdomains/thorin'

const RecordItem = ({
  itemKey,
  value,
  showLegacy,
  type,
}: {
  itemKey?: string
  value: string
  showLegacy?: boolean
  type: 'text' | 'address' | 'contentHash'
}) => {
  const keyLabel = showLegacy && itemKey ? itemKey?.replace('_LEGACY', '') : itemKey
  const keySubLabel = showLegacy ? 'LEGACY' : undefined

  return (
    <ThorinRecordItem
      size="large"
      value={value}
      keyLabel={keyLabel}
      keySublabel={keySubLabel}
      data-testid={
        itemKey ? `name-details-${type}-${itemKey.toLowerCase()}` : `name-details-${type}`
      }
    >
      {value}
    </ThorinRecordItem>
  )
}

export default RecordItem
