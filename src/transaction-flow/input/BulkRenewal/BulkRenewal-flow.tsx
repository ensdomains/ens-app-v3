import { useState } from 'react'
import { namehash } from 'viem'
import { useClient, useReadContract } from 'wagmi'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { Dialog } from '@ensdomains/thorin'

import { InvoiceItem } from '@app/components/@atoms/Invoice/Invoice'
import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { bulkRenewalContract } from '@app/transaction-flow/transaction/bulkRenew'
import { REBATE_DATE } from '@app/utils/constants'
import { calculateDatesDiff, secondsFromDateDiff, secondsToDate } from '@app/utils/date'
import { ONE_YEAR, secondsToYears } from '@app/utils/time'

export type Props = { data: { names: NameWithRelation[] } }

const abi = [
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'names',
        type: 'string[]',
      },
      {
        internalType: 'uint256',
        name: 'targetExpiry',
        type: 'uint256',
      },
    ],
    name: 'getTargetExpiryPriceData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'durations',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'prices',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const BulkRenewalFlow = ({ data }: Props) => {
  const sortedNames = data.names.toSorted((a, b) => a.expiryDate!.value! - b.expiryDate!.value!)

  const minDateDiff = calculateDatesDiff(sortedNames[0].expiryDate!.date, REBATE_DATE)

  const minSeconds = secondsFromDateDiff({
    startDate: sortedNames[0].expiryDate!.date,
    additionalDays: minDateDiff.diff.days,
    additionalMonths: minDateDiff.diff.months,
    additionalYears: minDateDiff.diff.years,
  })

  const [seconds, setSeconds] = useState(() => minSeconds)
  const [durationType, setDurationType] = useState<'years' | 'date'>('years')

  // const client = useClient()

  // const {
  //   data: expiryData,
  //   error,
  //   status,
  // } = useReadContract({
  //   abi,
  //   address: bulkRenewalContract[client.chain.id!]!,
  //   functionName: 'getTargetExpiryPriceData',
  //   args: [data.names.map((name) => namehash(name.name!)), BigInt(seconds)],
  // })

  return (
    <>
      <Dialog.Heading title={`Extend ${data.names.length} names`} />
      <Dialog.Content>
        <DateSelection
          {...{ seconds, setSeconds, durationType }}
          minSeconds={minSeconds}
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
