import { useState } from 'react'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { Dialog } from '@ensdomains/thorin'

import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { ONE_YEAR } from '@app/utils/time'

export type Props = { data: { names: NameWithRelation[] } }

const BulkRenewalFlow = ({ data }: Props) => {
  const sortedNames = data.names.toSorted((a, b) => a.expiryDate?.value - b.expiryDate?.value)

  const [seconds, setSeconds] = useState(() => 5 * ONE_YEAR)
  const [durationType, setDurationType] = useState<'years' | 'date'>('years')

  return (
    <>
      <Dialog.Heading title={`Extend ${data.names.length} names`} />
      <Dialog.Content>
        <DateSelection
          {...{ seconds, setSeconds, durationType }}
          minSeconds={5 * ONE_YEAR}
          mode="extend"
          onChangeDurationType={setDurationType}
        />
      </Dialog.Content>
      {sortedNames.map((name) => (
        <div key={name.name}>
          <span>{name.name}</span>
          <span>{name.expiryDate?.date.toDateString()}</span>
        </div>
      ))}
    </>
  )
}

export default BulkRenewalFlow
