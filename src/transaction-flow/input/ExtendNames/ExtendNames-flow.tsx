import { BigNumber } from 'ethers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useFeeData } from 'wagmi'

import { Avatar, Button, Dialog, Helper, ScrollBox, mq } from '@ensdomains/thorin'

import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import gasLimitDictionary from '@app/constants/gasLimits'
import { useAvatar } from '@app/hooks/useAvatar'
import { useEstimateGasLimitForTransactions } from '@app/hooks/useEstimateGasLimitForTransactions'
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
    max-height: 90vh;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};

    ${mq.sm.min(
      css`
        min-width: 600px;
      `,
    )}
  `,
)

const ScrollBoxWrapper = styled(ScrollBox)(
  ({ theme }) => css`
    width: 100%;
    padding-right: ${theme.space['2']};
    margin-right: -${theme.space['2']};
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};
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

const NamesListContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

type NamesListProps = {
  names: string[]
}

const NamesList = ({ names }: NamesListProps) => {
  return (
    <NamesListContainer data-testid="extend-names-names-list">
      {names.map((name) => (
        <NamesListItem key={name} name={name} />
      ))}
    </NamesListContainer>
  )
}

type Data = {
  names: string[]
  isSelf?: boolean
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ExtendNames = ({ data: { names, isSelf }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const [view, setView] = useState<'name-list' | 'registration'>(
    names.length > 1 ? 'name-list' : 'registration',
  )

  const [years, setYears] = useState(1)
  const duration = yearsToSeconds(years)

  const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('eth')
  const fiatUnit = 'usd'
  const currencyDisplay = currencyUnit === 'fiat' ? fiatUnit : 'eth'

  const { base: rentFee, loading: priceLoading } = usePrice(names, true)

  const totalRentFee = rentFee ? rentFee.mul(years) : undefined
  const transactions = [
    makeTransactionItem('extendNames', { names, duration, rentPrice: totalRentFee!, isSelf }),
  ]

  const {
    gasLimit: estimatedGasLimit,
    error: estimateGasLimitError,
    isLoading: isEstimateGasLoading,
  } = useEstimateGasLimitForTransactions(transactions)

  const hardcodedGasLimit = gasLimitDictionary.RENEW(names.length)
  const gasLimit = estimatedGasLimit || hardcodedGasLimit

  const { data: feeData, isLoading: isFeeDataLoading } = useFeeData()
  const gasPrice = feeData?.maxFeePerGas || undefined
  const transactionFee = gasPrice ? gasLimit.mul(gasPrice) : BigNumber.from('0')

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
          disabled: !!estimateGasLimitError,
          onClick: () => {
            if (!totalRentFee) return
            dispatch({
              name: 'setTransactions',
              payload: transactions,
            })
            dispatch({ name: 'setFlowStage', payload: 'transaction' })
          },
          children: t('action.next', { ns: 'common' }),
        }

  if (isFeeDataLoading || isEstimateGasLoading || priceLoading) {
    return (
      <Container>
        <TransactionLoader />
      </Container>
    )
  }
  return (
    <Container data-testid="extend-names-modal">
      <Dialog.Heading title={title} />
      <ScrollBoxWrapper>
        <InnerContainer>
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
                  message={t('input.extendNames.bannerMsg')}
                />
              )}
              <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
              {!!estimateGasLimitError && (
                <Helper type="warning">{t('input.extendNames.gasLimitError')}</Helper>
              )}
            </>
          )}
        </InnerContainer>
      </ScrollBoxWrapper>
      <Dialog.Footer
        leading={
          <Button shadowless tone="grey" variant="secondary" onClick={onDismiss}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={<Button shadowless {...trailingButtonProps} data-testid="extend-names-button" />}
      />
    </Container>
  )
}

export default ExtendNames
