import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useBalance, useClient, useEstimateGas, useReadContract } from 'wagmi'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { Dialog, Heading, Helper, OutlinkSVG, Typography } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { Calendar } from '@app/components/@atoms/Calendar/Calendar'
import { Invoice, InvoiceItem } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { EligibleForTokens } from '@app/components/pages/migrate/EligibleForTokens'
import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { bulkRenewalContract } from '@app/transaction-flow/transaction/bulkRenew'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE, REBATE_DATE } from '@app/utils/constants'
import useUserConfig from '@app/utils/useUserConfig'
import { formatDurationOfDates } from '@app/utils/utils'

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
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'NameAvailable',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'NameBeyondWantedExpiryDate',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    name: 'NameMismatchedPrice',
    type: 'error',
  },
] as const

const CalendarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    align-items: center;
    width: ${theme.space.full};
  `,
)

const YearsViewSwitch = styled.button(
  ({ theme }) => css`
    color: ${theme.colors.bluePrimary};
    cursor: pointer;
    font-size: ${theme.fontSizes.small};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const GasEstimationCacheableComponent = styled(CacheableComponent)(
  ({ theme }) => css`
    width: 100%;
    gap: ${theme.space['4']};
    display: flex;
    flex-direction: column;
  `,
)

const BulkRenewalFlow = ({ data }: Props) => {
  const [date, setDate] = useState(REBATE_DATE)
  const [durationType, setDurationType] = useState<'years' | 'date'>('date')

  const client = useClient()

  const { address } = useAccount()

  const { data: balance } = useBalance({
    address,
  })

  const dateAsBigInt = BigInt(date.getTime() / 1000)

  const {
    data: expiryData,
    error,
    status,
  } = useReadContract({
    abi,
    address: bulkRenewalContract[client.chain.id!]!,
    functionName: 'getTargetExpiryPriceData',
    args: [data.names.map((name) => name.labelName!), dateAsBigInt],
  })

  const [total, durations, prices] = expiryData! as [bigint, bigint[], bigint[]]

  const {
    data: { gasEstimate: estimatedGasLimit, gasCost: transactionFee },
    error: estimateGasLimitError,
    isLoading: isEstimateGasLoading,
    gasPrice,
  } = useEstimateGasWithStateOverride({
    transactions: [
      {
        name: 'bulkRenew',
        data: {
          names: data.names.map((name) => name.labelhash),
          durations,
          prices,
        },
        stateOverride: [{ address: address! }],
      },
    ],
  })

  const { t } = useTranslation(['transactionFlow', 'common'])

  const now = new Date()

  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const items: InvoiceItem[] = [
    {
      label: t('input.extendNames.invoice.extension', {
        time: formatDurationOfDates({ startDate: now, endDate: date, t }),
      }),
      value: dateAsBigInt,
      bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    },
    {
      label: t('input.extendNames.invoice.transaction'),
      value: transactionFee,
      bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    },
  ]

  return (
    <>
      <Dialog.Heading title={`Extend ${data.names.length} names`} />
      <Dialog.Content>
        <CalendarContainer>
          {durationType === 'date' ? (
            <Calendar
              value={date}
              onChange={(e) => {
                const { valueAsDate } = e.currentTarget
                if (valueAsDate) {
                  setDate(valueAsDate)
                }
              }}
              highlighted
              min={REBATE_DATE}
            />
          ) : (
            <PlusMinusControl
              highlighted
              minValue={1}
              value={date.getFullYear() - now.getFullYear()}
              onChange={(e) => {
                const newYears = parseInt(e.target.value)

                if (!Number.isNaN(newYears))
                  setDate(new Date(now.getFullYear() + newYears, date.getMonth(), date.getDate()))
              }}
            />
          )}
          <Typography color="greyPrimary" fontVariant="smallBold" data-testid="date-selection-info">
            {formatDurationOfDates({
              startDate: now,
              endDate: date,
              postFix: ' extension. ',
              t,
            })}
            <YearsViewSwitch
              type="button"
              data-testid="date-selection"
              onClick={() => setDurationType(durationType === 'years' ? 'date' : 'years')}
            >
              {t(`calendar.pick_by_${durationType === 'date' ? 'years' : 'date'}`, {
                ns: 'common',
              })}
            </YearsViewSwitch>
          </Typography>
        </CalendarContainer>
      </Dialog.Content>
      {error ? <Helper type="error">{error.message}</Helper> : null}
      <GasEstimationCacheableComponent $isCached={isEstimateGasLoading}>
        <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
        {(!!estimateGasLimitError ||
          (!!estimatedGasLimit && !!balance?.value && balance.value < estimatedGasLimit)) && (
          <Helper type="warning">{t('input.extendNames.gasLimitError')}</Helper>
        )}
      </GasEstimationCacheableComponent>
      <EligibleForTokens amount={data.names.length} />
    </>
  )
}

export default BulkRenewalFlow
