import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dialog } from '@ensdomains/thorin'

import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { useAvatar } from '@app/hooks/useAvatar'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { useZorb } from '@app/hooks/useZorb'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import GasDisplay from '../../../components/@atoms/GasDisplay'
import { useChainId } from '../../../hooks/useChainId'
import { useExpiry } from '../../../hooks/useExpiry'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    width: 100%;
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
  ({ theme }) => css`
    flex: 1;
    position: relative;
    overflow: hidden;
  `,
)

const NamesListItemTitle = styled.div(
  ({ theme }) => css`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.extraLarge};
    line-height: 1.36;
    color: ${theme.colors.text};
  `,
)

const NamesListItemSubtitle = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.normal};
    font-size: ${theme.fontSizes.small};
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
        <NamesListItemTitle>{name} dasdfa asdfas</NamesListItemTitle>
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

  const [view, setView] = useState<'name-list' | 'registration'>('name-list')
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

  const title = view === 'name-list' ? 'Extend 3 Names' : 'Extend Names'

  const trailingButtonProps =
    view === 'name-list'
      ? { onClick: () => setView('registration'), children: t('action.next', { ns: 'common' }) }
      : {
          onClick: () => {
            dispatch({
              name: 'setTransactions',
              payload: [
                makeTransactionItem('extendNames', {
                  names,
                  years,
                }),
              ],
            })
            dispatch({ name: 'setFlowStage', payload: 'transaction' })
          },
          children: t('action.save', { ns: 'common' }),
        }

  if (transactionDataLoading || ethPriceLoading) {
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
