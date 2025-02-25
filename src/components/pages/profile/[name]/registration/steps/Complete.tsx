import dynamic from 'next/dynamic'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type ConfettiT from 'react-confetti'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { tokenise } from '@ensdomains/ensjs/utils'
import { Button, Typography } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import NFTTemplate from '@app/components/@molecules/NFTTemplate/NFTTemplate'
import { Card } from '@app/components/Card'
import { useRegistrationValueFromRegisterReceipt } from '@app/hooks/pages/register/useRegistrationValueFromRegisterReceipt'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { dateFromDateDiff } from '@app/utils/date'
import { isMobileDevice } from '@app/utils/device'
import { secondsToDays } from '@app/utils/time'
import { formatDurationOfDates } from '@app/utils/utils'

import { RegistrationReducerDataItem } from '../types'
import { Invoice } from './Invoice'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    text-align: center;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    canvas {
      max-width: ${theme.space.full};
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
    }
  `,
)

const NFTContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['56']};
    height: ${theme.space['56']};
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;

    @media (min-width: ${theme.breakpoints.sm}px) {
      width: ${theme.space['80']};
      height: ${theme.space['80']};
    }
  `,
)

const InvoiceContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      gap: ${theme.space['6']};
      flex-direction: row;
    }
  `,
)

const TitleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingOne};
    font-weight: 800;
    line-height: ${theme.lineHeights.headingOne};
  `,
)

const SubtitleWithGradient = styled(Typography)(
  ({ theme }) => css`
    display: inline;

    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;

    background-image: ${theme.colors.blueGradient};
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    /* stylelint-enable property-no-vendor-prefix */

    b {
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      color: transparent;
      line-height: 100%;
    }
  `,
)

const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

const useEthInvoice = (
  name: string,
  seconds: number,
  isMoonpayFlow: boolean,
): { InvoiceFilled?: React.ReactNode; avatarSrc?: string } => {
  const { t } = useTranslation('register')
  const { address } = useAccount()
  const keySuffix = `${name}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction } = useTransactionFlow()

  const commitTxFlow = getLatestTransaction(commitKey)
  const registerTxFlow = getLatestTransaction(registerKey)

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()

  const commitReceipt = commitTxFlow?.minedData
  const registerReceipt = registerTxFlow?.minedData

  const { data: registrationValue, isLoading: isRegistrationValueLoading } =
    useRegistrationValueFromRegisterReceipt({ registerReceipt })

  const isLoading = !commitReceipt || !registerReceipt || isRegistrationValueLoading

  useEffect(() => {
    const storage = localStorage.getItem(`avatar-src-${name}`)
    if (storage) setAvatarSrc(storage)
  }, [name])

  const InvoiceFilled = useMemo(() => {
    if (isLoading) return null
    const value = registrationValue || 0n

    const commitGasUsed = commitReceipt?.gasUsed ? BigInt(commitReceipt.gasUsed) : 0n
    const effectiveGasPrice = commitReceipt?.effectiveGasPrice
      ? BigInt(commitReceipt.effectiveGasPrice)
      : 0n
    const registerGasUsed = registerReceipt?.gasUsed ? BigInt(registerReceipt.gasUsed) : 0n
    const registerGasPrice = registerReceipt?.effectiveGasPrice
      ? BigInt(registerReceipt.effectiveGasPrice)
      : 0n

    const commitNetFee = commitGasUsed * effectiveGasPrice
    const registerNetFee = registerGasUsed * registerGasPrice
    const totalNetFee = commitNetFee && registerNetFee ? commitNetFee + registerNetFee : 0n

    const date = dateFromDateDiff({
      startDate: new Date(),
      additionalDays: Math.floor(secondsToDays(seconds)),
    })

    return (
      <Invoice
        name={name}
        expiryDate={date}
        expiryTitle={t('invoice.expiry')}
        items={[
          {
            label: t('invoice.timeRegistration', {
              time: formatDurationOfDates({
                startDate: new Date(),
                endDate: date,
                shortYears: isMobileDevice(),
                t,
              }),
            }),
            value,
          },
          { label: t('invoice.transactionFees'), value: totalNetFee },
        ]}
      />
    )
  }, [isLoading, registrationValue, commitReceipt, registerReceipt, t, name, seconds])

  if (isMoonpayFlow) return { InvoiceFilled: null, avatarSrc }

  return { InvoiceFilled, avatarSrc }
}

type Props = {
  name: string
  beautifiedName: string
  callback: (toProfile: boolean) => void
  registrationData: RegistrationReducerDataItem
  isMoonpayFlow: boolean
}

const Complete = ({ name, beautifiedName, callback, isMoonpayFlow, registrationData }: Props) => {
  const { t } = useTranslation('register')
  const { width, height } = useWindowSize()
  const { InvoiceFilled, avatarSrc } = useEthInvoice(name, registrationData.seconds, isMoonpayFlow)

  const nameWithColourEmojis = useMemo(() => {
    const data = tokenise(beautifiedName)
    return data.map((item, i) => {
      if (item.type === 'emoji') {
        const str = String.fromCodePoint(...item.emoji)
        // eslint-disable-next-line react/no-array-index-key
        return <Fragment key={`${str}-${i}`}>{str}</Fragment>
      }
      let str = '.'
      if ('cps' in item) str = String.fromCodePoint(...item.cps)
      if ('cp' in item) str = String.fromCodePoint(item.cp)
      // eslint-disable-next-line react/no-array-index-key
      return <b key={`${str}-${i}`}>{str}</b>
    })
  }, [beautifiedName])

  return (
    <StyledCard>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        colors={[
          '#49B393',
          '#5298FF',
          '#5854D6',
          '#5AC8FA',
          '#AF52DE',
          '#D55555',
          '#FF2D55',
          '#FF9500',
          '#FFCC00',
        ]}
        pieceWidth={{ min: 10, max: 20 }}
        pieceHeight={{ min: 20, max: 50 }}
        pieceShape="Square"
        gravity={0.25}
        initialVelocityY={20}
      />
      <TitleContainer>
        <Title>{t('steps.complete.heading')}</Title>
        <Typography style={{ display: 'inline' }} fontVariant="headingThree" weight="bold">
          {t('steps.complete.subheading')}
          <SubtitleWithGradient>{nameWithColourEmojis}</SubtitleWithGradient>
        </Typography>
      </TitleContainer>
      <InvoiceContainer>
        <NFTContainer>
          <NFTTemplate backgroundImage={avatarSrc} isNormalised name={name} />
        </NFTContainer>
        {InvoiceFilled}
      </InvoiceContainer>
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={() => callback(false)}>
            {t('steps.complete.registerAnother')}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="view-name" onClick={() => callback(true)}>
            {t('steps.complete.viewName')}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Complete
