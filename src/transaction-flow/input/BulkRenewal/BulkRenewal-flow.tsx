import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ContractFunctionRevertedError, decodeErrorResult, namehash } from 'viem'
import { useClient, useReadContract } from 'wagmi'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { Dialog, Heading, Helper, OutlinkSVG, Typography } from '@ensdomains/thorin'

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

const EligibleForTokens = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    gap: ${theme.space['2']};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: ${theme.space.full};
    border-radius: ${theme.radii['2xLarge']};
    background: ${theme.colors.greenSurface};

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['2']};
      color: ${theme.colors.greenPrimary};
    }
  `,
)

const BulkRenewalFlow = ({ data }: Props) => {
  // Sort from the ones that expire earlier to later
  const sortedNames = data.names.toSorted((a, b) => a.expiryDate!.value! - b.expiryDate!.value!)

  const minDateDiff = calculateDatesDiff(sortedNames[0].expiryDate!.date, REBATE_DATE)

  const minSeconds =
    secondsFromDateDiff({
      startDate: sortedNames[0].expiryDate!.date,
      additionalDays: minDateDiff.diff.days,
      additionalMonths: minDateDiff.diff.months,
      additionalYears: minDateDiff.diff.years,
    }) + 84600

  const [seconds, setSeconds] = useState(minSeconds)
  const [durationType, setDurationType] = useState<'years' | 'date'>('years')

  const client = useClient()

  const {
    data: expiryData,
    error,
    status,
  } = useReadContract({
    abi,
    address: bulkRenewalContract[client.chain.id!]!,
    functionName: 'getTargetExpiryPriceData',
    args: [data.names.map((name) => namehash(name.name!)), BigInt(seconds)],
  })

  const { t } = useTranslation('common')

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
      {status}
      {error ? <Helper type="error">{error.message}</Helper> : null}
      <EligibleForTokens>
        <Typography fontVariant="largeBold">Eligible for {data.names.length} $ENS</Typography>
        something something
        <Link href="#" target="_blank" rel="noreferrer noopener">
          <Typography color="greenPrimary" fontVariant="bodyBold">
            {t('action.learnMore')}
          </Typography>
          <OutlinkSVG />
        </Link>
      </EligibleForTokens>
    </>
  )
}

export default BulkRenewalFlow
