import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import GasIcon from '@app/assets/Gas.svg'
import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import useEstimateTransactionCost from '@app/hooks/useEstimateTransactionCost'
import { useEthPrice } from '@app/hooks/useEthPrice'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { CurrencyUnit } from '@app/types'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    align-items: center;
  `,
)

const PlusMinusWrapper = styled.div(
  () => css`
    width: 100%;
    max-width: 60%;
    overflow: hidden;
    display: flex;
  `,
)

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

type Data = {
  names: string[]
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ExtendNames = ({ data: { names }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const fiatUnit = 'usd'

  const [years, setYears] = useState(1)
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const currencyDisplay = currencyUnit === 'fiat' ? fiatUnit : 'eth'

  const { data: transactionData, isLoading: transactionDataLoading } =
    useEstimateTransactionCost('RENEW')
  const { gasPrice, transactionFee } = transactionData || {}
  const gasLabel = gasPrice ? `${formatUnits(gasPrice, 'gwei')} gwei` : '-'

  const { data: ethPrice, loading: ethPriceLoading } = useEthPrice()

  const rentFee = ethPrice ? BigNumber.from('5000000000000000000').div(ethPrice) : undefined
  const totalRentFee = rentFee ? rentFee.mul(years) : undefined

  const items = [
    {
      label: `${years} year extension`,
      value: totalRentFee,
    },
    {
      label: 'transaction fee',
      value: transactionFee,
    },
  ]

  if (transactionDataLoading || ethPriceLoading) {
    return <TransactionLoader />
  }
  return (
    <>
      <Dialog.Heading title={t('Extend Names')} />
      <Container>
        <PlusMinusWrapper>
          <PlusMinusControl
            minValue={1}
            value={years}
            onChange={(e) => {
              const newYears = parseInt(e.target.value)
              if (!Number.isNaN(newYears)) setYears(newYears)
            }}
          />
        </PlusMinusWrapper>
        <OptionBar>
          <div>
            <GasIcon />
            {gasLabel}
          </div>
          <CurrencySwitch value={currencyUnit} onChange={(unit) => setCurrencyUnit(unit)} />
        </OptionBar>
        {rentFee && transactionFee && gasPrice && (
          <RegistrationTimeComparisonBanner
            rentFee={rentFee}
            transactionFee={transactionFee}
            message="Extending for multiple years will save money on network costs by avoiding yearly transactions."
          />
        )}
        <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
      </Container>
      <Dialog.Footer leading={<Button>Cancel</Button>} trailing={<Button>Save</Button>} />
    </>
  )
}

export default ExtendNames
