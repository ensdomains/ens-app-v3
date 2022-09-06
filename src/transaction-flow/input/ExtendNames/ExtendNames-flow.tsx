import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { Dialog, Button } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import GasIcon from '@app/assets/Gas.svg'
import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { useState } from 'react'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'

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

  const [view, setView] = useState<'name-list' | 'registration'>()
  const [years, setYears] = useState(1)
  const [currencyUnit, setCurrencyUnit] = useState<'eth' | 'usd'>('eth')

  const { data: transactionData, loading: transactionDataLoading } = useEstimateTransactionCost([
    'REGISTER',
    'COMMIT',
  ])
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
        {view === 'name-list' ? (
          <>HELLO</>
        ) : (
          <>
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
                gasPrice={gasPrice}
                message="Extending for multiple years will save money on network costs by avoiding yearly transactions."
              />
            )}
            <Invoice items={items} unit={currencyUnit} totalLabel="Estimated total" />
          </>
        )}
      </Container>
      <Dialog.Footer leading={<Button>Cancel</Button>} trailing={<Button>Save</Button>} />
    </>
  )
}

export default ExtendNames
