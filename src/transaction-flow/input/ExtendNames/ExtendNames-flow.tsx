import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousDistinct } from 'react-use'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { parseEther } from 'viem'
import { useAccount, useBalance, useEnsAvatar } from 'wagmi'

import { Avatar, Button, CurrencyToggle, Dialog, Helper, Typography } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { makeCurrencyDisplay } from '@app/components/@atoms/CurrencyText/CurrencyText'
import { Invoice, InvoiceItem } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import { DateSelection } from '@app/components/@molecules/DateSelection/DateSelection'
import { useEstimateGasWithStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { usePrice } from '@app/hooks/ensjs/public/usePrice'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { useZorb } from '@app/hooks/useZorb'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from '@app/utils/constants'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { ONE_DAY, ONE_YEAR, secondsToYears, yearsToSeconds } from '@app/utils/time'
import useUserConfig from '@app/utils/useUserConfig'
import { deriveYearlyFee, formatDurationOfDates } from '@app/utils/utils'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import GasDisplay from '../../../components/@atoms/GasDisplay'
import { SearchViewLoadingView } from '../SendName/views/SearchView/views/SearchViewLoadingView'
import { validateExtendNamesDuration } from './utils/validateExtendNamesDuration'

type View = 'name-list' | 'no-ownership-warning' | 'registration'

const PlusMinusWrapper = styled.div(
  () => css`
    width: 100%;
    overflow: hidden;
    display: flex;
  `,
)

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
    background: ${theme.colors.backgroundPrimary};
  `,
)

const NamesListItemSubtitle = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.normal};
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.grey};
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

const CenteredMessage = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const NamesListItem = ({ name }: { name: string }) => {
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })
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
  seconds?: number
  isSelf?: boolean
  minSeconds?: number
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ExtendNames = ({
  data: { seconds: defaultSeconds, names, isSelf, minSeconds = ONE_DAY },
  dispatch,
  onDismiss,
}: Props) => {
  const { t } = useTranslation(['transactionFlow', 'common'])

  const [seconds, setSeconds] = useState(
    validateExtendNamesDuration({ duration: defaultSeconds ?? ONE_YEAR })!,
  )
  const years = secondsToYears(seconds)
  const [durationType, setDurationType] = useState<'years' | 'date'>('years')

  const { data: ethPrice, isLoading: isEthPriceLoading } = useEthPrice()
  const { address, isConnected: isAccountConnected } = useAccount()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  })

  const { userConfig, setCurrency } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const { data: priceData, isLoading: isPriceLoading } = usePrice({
    nameOrNames: names,
    duration: seconds,
  })

  const totalRentFee = priceData ? priceData.base + priceData.premium : 0n
  const yearlyFee = priceData?.base ? deriveYearlyFee({ duration: seconds, price: priceData }) : 0n
  const previousYearlyFee = usePreviousDistinct(yearlyFee) || 0n
  const isShowingPreviousYearlyFee = yearlyFee === 0n && previousYearlyFee > 0n

  const isExpiryEnabled = names.length === 1
  const { data: expiryData, isLoading: isExpiryLoading } = useExpiry({
    enabled: isExpiryEnabled,
    name: names[0],
  })
  const isExpiryEnabledAndLoading = isExpiryEnabled && isExpiryLoading

  const expiryDate = expiryData?.expiry?.date
  const extendedDate = expiryDate ? new Date(expiryDate.getTime() + seconds * 1000) : undefined

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
          duration: seconds,
          names,
          startDateTimestamp: expiryDate?.getTime(),
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
    enabled: !!totalRentFee && !!address && seconds > 0 && totalRentFee > 0n,
  })

  const previousTransactionFee = usePreviousDistinct(transactionFee) || 0n

  const isShowingPreviousTransactionFee = transactionFee === 0n && previousTransactionFee > 0n

  const items: InvoiceItem[] = [
    {
      label: t('input.extendNames.invoice.extension', {
        time: formatDurationOfDates({ startDate: expiryDate, endDate: extendedDate, t }),
      }),
      value: totalRentFee,
      bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    },
    {
      label: t('input.extendNames.invoice.transaction'),
      value: transactionFee,
      bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    },
  ]

  const flow: View[] = useMemo(
    () =>
      match([names.length, isSelf])
        .with([P.when((length) => length > 1), true], () => ['name-list', 'registration'] as View[])
        .with(
          [P.when((length) => length > 1), P._],
          () => ['no-ownership-warning', 'name-list', 'registration'] as View[],
        )
        .with([P._, true], () => ['registration'] as View[])
        .otherwise(() => ['no-ownership-warning', 'registration'] as View[]),
    [names.length, isSelf],
  )
  const [viewIdx, setViewIdx] = useState(0)
  const incrementView = () => setViewIdx(() => Math.min(flow.length - 1, viewIdx + 1))
  const decrementView = () => (viewIdx <= 0 ? onDismiss() : setViewIdx(viewIdx - 1))
  const view = flow[viewIdx]

  const isBaseDataLoading =
    !isAccountConnected || isBalanceLoading || isExpiryEnabledAndLoading || isEthPriceLoading
  const isRegisterLoading = isPriceLoading || (isEstimateGasLoading && !estimateGasLimitError)

  const { title, alert, buttonProps } = match(view)
    .with('no-ownership-warning', () => ({
      title: t('input.extendNames.ownershipWarning.title', {
        name: names.at(0),
        count: names.length,
      }),
      alert: 'warning' as const,
      buttonProps: {
        onClick: incrementView,
        children: t('action.understand', { ns: 'common' }),
      },
    }))
    .with('name-list', () => ({
      title: t('input.extendNames.title', { name: names.at(0), count: names.length }),
      alert: undefined,
      buttonProps: {
        onClick: incrementView,
        children: t('action.next', { ns: 'common' }),
      },
    }))
    .with('registration', () => ({
      title: t('input.extendNames.title', { name: names.at(0), count: names.length }),
      alert: undefined,
      buttonProps: {
        disabled: isRegisterLoading,
        onClick: () => {
          if (!totalRentFee) return
          const transactions = createTransactionItem('extendNames', {
            names,
            duration: seconds,
            startDateTimestamp: expiryDate?.getTime(),
            displayPrice: makeCurrencyDisplay({
              eth: totalRentFee,
              ethPrice,
              bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
              currency: userConfig.currency === 'fiat' ? 'usd' : 'eth',
            }),
          })
          dispatch({ name: 'setTransactions', payload: [transactions] })
          dispatch({ name: 'setFlowStage', payload: 'transaction' })
        },
        children: t('action.next', { ns: 'common' }),
      },
    }))
    .exhaustive()

  return (
    <>
      <Dialog.Heading title={title} alert={alert} />
      <Dialog.Content data-testid="extend-names-modal">
        {match([view, isBaseDataLoading])
          .with([P._, true], () => <SearchViewLoadingView />)
          .with(['no-ownership-warning', false], () => (
            <CenteredMessage>
              {t('input.extendNames.ownershipWarning.description', { count: names.length })}
            </CenteredMessage>
          ))
          .with(['name-list', false], () => {
            return <NamesList names={names} />
          })
          .otherwise(() => (
            <>
              <PlusMinusWrapper>
                {names.length === 1 ? (
                  <DateSelection
                    {...{ seconds, setSeconds }}
                    name={names[0]}
                    minSeconds={minSeconds}
                    mode="extend"
                    expiry={Number(expiryData?.expiry.value)}
                    durationType={durationType}
                    onChangeDurationType={setDurationType}
                  />
                ) : (
                  <PlusMinusControl
                    minValue={1}
                    value={years}
                    onChange={(e) => {
                      const newYears = parseInt(e.target.value)
                      if (!Number.isNaN(newYears)) setSeconds(yearsToSeconds(newYears))
                    }}
                  />
                )}
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
              <GasEstimationCacheableComponent
                $isCached={
                  isEstimateGasLoading ||
                  isShowingPreviousTransactionFee ||
                  isShowingPreviousYearlyFee
                }
              >
                <Invoice items={items} unit={currencyDisplay} totalLabel="Estimated total" />
                {(!!estimateGasLimitError ||
                  (!!estimatedGasLimit &&
                    !!balance?.value &&
                    balance.value < estimatedGasLimit)) && (
                  <Helper alert="warning">{t('input.extendNames.gasLimitError')}</Helper>
                )}
              </GasEstimationCacheableComponent>
            </>
          ))}
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={decrementView}>
            {t(viewIdx === 0 ? 'action.cancel' : 'action.back', { ns: 'common' })}
          </Button>
        }
        trailing={<Button {...buttonProps} data-testid="extend-names-confirm" />}
      />
    </>
  )
}

export default ExtendNames
