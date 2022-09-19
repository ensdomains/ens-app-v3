import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dialog, mq } from '@ensdomains/thorin'

import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import { useAvatar } from '@app/hooks/useAvatar'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { useZorb } from '@app/hooks/useZorb'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { CurrencyUnit } from '@app/types'
import { yearsToSeconds } from '@app/utils/utils'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import GasDisplay from '../../../components/@atoms/GasDisplay'
import { useChainId } from '../../../hooks/useChainId'
import { useExpiry } from '../../../hooks/useExpiry'
import { usePrice } from '../../../hooks/usePrice'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: ${theme.space['4']};
    align-items: center;

    ${mq.sm.min(
      css`
        min-width: 600px;
      `,
    )}
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

const NamesListItemContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
    height: ${theme.space['16']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['2']};
    padding-right: ${theme.space['5']};
  `,
)

const NamesListItemAvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const NamesListItemContent = styled.div(
  () => css`
    flex: 1;
    position: relative;
    overflow: hidden;
  `,
)

const NamesListItemTitle = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['5.5']};
    background: 'red';
  `,
)

const NamesListItemSubtitle = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.normal};
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.textTertiary};
  `,
)

const NamesListItem = ({ name }: { name: string }) => {
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
  const zorb = useZorb(name, 'name')
  const { expiry, loading: expiryLoading } = useExpiry(name)
  console.log(expiry, typeof expiry?.expiry)

  if (expiryLoading) return null
  return (
    <NamesListItemContainer>
      <NamesListItemAvatarWrapper>
        <Avatar src={avatar || zorb} label={name} />
      </NamesListItemAvatarWrapper>
      <NamesListItemContent>
        <NamesListItemTitle>
          <StyledName name={name} />
        </NamesListItemTitle>
        {expiry?.expiry && (
          <NamesListItemSubtitle>
            <ShortExpiry expiry={expiry.expiry} textOnly />
          </NamesListItemSubtitle>
        )}
      </NamesListItemContent>
    </NamesListItemContainer>
  )
}

type NamesListProps = {
  names: string[]
}

const NamesList = ({ names }: NamesListProps) => {
  return (
    <>
      {names.map((name) => (
        <NamesListItem key={name} name={name} />
      ))}
    </>
  )
}

type Data = {
  names: string[]
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ExtendNames = ({ data: { names }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const [view, setView] = useState<'name-list' | 'registration'>(
    names.length ? 'name-list' : 'registration',
  )
  const [years, setYears] = useState(1)
  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const currencyDisplay = currencyUnit === 'fiat' ? 'usd' : 'eth'

  const { data: transactionData, loading: transactionDataLoading } = useEstimateTransactionCost([
    {
      key: 'RENEW',
      args: [names.length],
    },
  ])
  const { gasPrice, transactionFee } = transactionData || {}

  const { price, loading: priceLoading } = usePrice(names, yearsToSeconds(1), true)
  const rentFee = price?.base
  const totalRentFee = rentFee ? rentFee.mul(years) : undefined

  console.log('price', price?.base?.toNumber(), price?.premium?.toNumber())

  const items = [
    {
      label: t('input.extendNames.invoice.extension', { count: years }),
      value: totalRentFee,
    },
    {
      label: t('input.extendNames.invoice.transaction'),
      value: transactionFee,
    },
  ]

  const title = t('input.extendNames.title', { count: names.length })

  const trailingButtonProps =
    view === 'name-list'
      ? { onClick: () => setView('registration'), children: t('action.next', { ns: 'common' }) }
      : {
          onClick: () => {
            if (!totalRentFee) return
            dispatch({
              name: 'setTransactions',
              payload: [
                makeTransactionItem('extendNames', {
                  names,
                  years,
                  rentPrice: totalRentFee,
                }),
              ],
            })
            dispatch({ name: 'setFlowStage', payload: 'transaction' })
          },
          children: t('action.save', { ns: 'common' }),
        }

  if (transactionDataLoading || priceLoading) {
    return <TransactionLoader />
  }
  return (
    <>
      <Dialog.Heading title={title} />
      <Container>
        {view === 'name-list' ? (
          <NamesList names={names} />
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
              <GasDisplay gasPrice={gasPrice} />
              <CurrencySwitch
                fiat="usd"
                value={currencyUnit}
                onChange={(unit) => setCurrencyUnit(unit)}
              />
            </OptionBar>
            {rentFee && transactionFee && (
              <RegistrationTimeComparisonBanner
                rentFee={rentFee}
                transactionFee={transactionFee}
                message="Extending for multiple years will save money on network costs by avoiding yearly transactions."
              />
            )}
            <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
          </>
        )}
      </Container>
      <Dialog.Footer
        leading={
          <Button shadowless tone="grey" variant="secondary" onClick={onDismiss}>
            Back
          </Button>
        }
        trailing={<Button shadowless {...trailingButtonProps} />}
      />
    </>
  )
}

export default ExtendNames
