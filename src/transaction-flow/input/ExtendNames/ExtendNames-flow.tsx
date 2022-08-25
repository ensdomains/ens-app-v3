import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { Dialog, Button } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import GasIcon from '@app/assets/Gas.svg'
import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { useState } from 'react'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationUpsellBanner } from '@app/components/@atoms/RegistrationUpsellBanner/RegistrationUpsellBanner'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { useEthPrice } from '@app/hooks/useEthPrice'

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

  const [years, setYears] = useState(1)
  const [currencyUnit, setCurrencyUnit] = useState<'eth' | 'usd'>('eth')

  const { data } = useEstimateTransactionCost(['REGISTER', 'COMMIT'], 'ether')
  const { gasPrice, transactionCost } = data || {}

  const gasLabel = (gasPrice || 0) * 10 ** 9

  const { data: ethPrice } = useEthPrice()

  const rentFee = 5 / (ethPrice || 1)

  const items = [
    {
      label: `${years} year extension`,
      value: rentFee * years,
    },
    {
      label: 'transaction fee',
      value: transactionCost!,
    },
  ]
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
            {gasLabel?.toFixed(0)}
          </div>
          <CurrencySwitch value={currencyUnit} onChange={(unit) => setCurrencyUnit(unit)} />
        </OptionBar>
        {rentFee && transactionCost && (
          <RegistrationUpsellBanner rentFee={rentFee} transactionFee={transactionCost} />
        )}
        <Invoice items={items} unit={currencyUnit} totalLabel="total" />
      </Container>
      <Dialog.Footer leading={<Button>Cancel</Button>} trailing={<Button>Save</Button>} />
    </>
  )
}

export default ExtendNames
