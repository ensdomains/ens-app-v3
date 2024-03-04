import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { parseEther } from 'viem'
import { useAccount, useBalance, useEnsAvatar } from 'wagmi'

import { Avatar, Button, CurrencyToggle, Dialog, Helper, mq, ScrollBox } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { Invoice, InvoiceItem } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useZorb } from '@app/hooks/useZorb'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import useUserConfig from '@app/utils/useUserConfig'
import { yearsToSeconds } from '@app/utils/utils'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import GasDisplay from '../../../components/@atoms/GasDisplay'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    max-height: 60vh;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    `)}
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

const PlusMinusWrapper = styled.div(({ theme }) => [
  css`
    width: 100%;
    max-width: ${theme.space['80']};
    overflow: hidden;
    display: flex;
  `,
  mq.sm.min(css``),
])

const OptionBar = styled(CacheableComponent)(
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
    border: 1px solid ${theme.colors.border};
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

const GasEstimationCacheableComponent = styled(CacheableComponent)(
  ({ theme }) => css`
    width: 100%;
    gap: ${theme.space['4']};
    display: flex;
    flex-direction: column;
  `,
)

const NamesListItem = ({ name }: { name: string }) => {
  const { data: avatar } = useEnsAvatar({ name })
  const zorb = useZorb(name, 'name')
  const { data: expiry, isLoading: isExpiryLoading } = useExpiry({ name })

  if (isExpiryLoading) return null
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
            <ShortExpiry expiry={expiry.expiry.date} textOnly />
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

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
  })

  const [view, setView] = useState<'name-list' | 'registration'>(
    names.length > 1 ? 'name-list' : 'registration',
  )

  const [years, setYears] = useState(1)
  const duration = yearsToSeconds(years)

  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const { data: priceData, isLoading: isPriceLoading } = usePrice({
    nameOrNames: names,
    duration: yearsToSeconds(1),
  })
  const rentFee = priceData ? priceData.base + priceData.premium : undefined
  const totalRentFee = rentFee ? BigInt(rentFee) * BigInt(years) : undefined
  const transactions = [
    createTransactionItem('extendNames', { names, duration, rentPrice: totalRentFee!, isSelf }),
  ]

  const {
    data: { gasEstimate: estimatedGasLimit, gasCost: transactionFee },
    error: estimateGasLimitError,
    isLoading: isEstimateGasLoading,
    gasPrice,
  } = useEstimateGasWithStateOverride({
    transactions: [
      {
        name: 'extendNames',
        data: {
          names,
          duration,
          rentPrice: totalRentFee!,
          isSelf,
        },
        stateOverride: [
          {
            address: address!,
            // the value will only be used if totalRentFee is defined, dw
            balance: totalRentFee ? totalRentFee + parseEther('10') : 0n,
          },
        ],
      },
    ],
    enabled: !!rentFee,
  })

  const items: InvoiceItem[] = [
    {
      label: t('input.extendNames.invoice.extension', { count: years }),
      value: totalRentFee,
      bufferPercentage: 102n,
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
          disabled: !totalRentFee || !!estimateGasLimitError,
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
              <OptionBar $isCached={isPriceLoading}>
                <GasDisplay gasPrice={gasPrice} />
                <CurrencyToggle
                  size="small"
                  checked={userConfig.currency === 'fiat'}
                  onChange={(e) => setCurrency(e.target.checked ? 'fiat' : 'eth')}
                  data-testid="extend-names-currency-toggle"
                />
              </OptionBar>
              <GasEstimationCacheableComponent $isCached={isEstimateGasLoading}>
                <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
                {(!!estimateGasLimitError ||
                  (!!estimatedGasLimit &&
                    !!balance?.value &&
                    balance.value < estimatedGasLimit)) && (
                  <Helper type="warning">{t('input.extendNames.gasLimitError')}</Helper>
                )}
                {!!rentFee && !!transactionFee && (
                  <RegistrationTimeComparisonBanner
                    rentFee={rentFee}
                    transactionFee={transactionFee}
                    message={t('input.extendNames.bannerMsg')}
                  />
                )}
              </GasEstimationCacheableComponent>
            </>
          )}
        </InnerContainer>
      </ScrollBoxWrapper>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            {...trailingButtonProps}
            data-testid="extend-names-confirm"
            disabled={trailingButtonProps.disabled || isEstimateGasLoading}
          />
        }
      />
    </Container>
  )
}

export default ExtendNames
