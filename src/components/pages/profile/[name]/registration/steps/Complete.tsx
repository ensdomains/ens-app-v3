import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import type ConfettiT from 'react-confetti'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useTransaction } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import NFTTemplate from '@app/components/@molecules/NFTTemplate/NFTTemplate'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

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

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const NFTContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['56']};
    height: ${theme.space['56']};
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;

    ${mq.sm.min(css`
      width: ${theme.space['80']};
      height: ${theme.space['80']};
    `)}
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
    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;

    b {
      background-image: ${theme.colors.gradients.blue};
      /* stylelint-disable property-no-vendor-prefix */
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      /* stylelint-enable property-no-vendor-prefix */
      color: transparent;
    }
  `,
)

const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

const useEthInvoice = (
  name: string,
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

  const { data: registerData, isLoading: registerLoading } = useTransaction({
    hash: registerTxFlow?.hash as `0x${string}` | undefined,
  })
  const isLoading = !commitReceipt || !registerReceipt || registerLoading

  useEffect(() => {
    const storage = localStorage.getItem(`avatar-src-${name}`)
    if (storage) setAvatarSrc(storage)
  }, [name])

  const InvoiceFilled = useMemo(() => {
    if (isLoading) return null
    const value = BigNumber.from(registerData?.value) || BigNumber.from(0)

    const commitGasUsed = BigNumber.from(commitReceipt?.gasUsed || 0)
    const registerGasUsed = BigNumber.from(registerReceipt?.gasUsed || 0)

    const commitNetFee = commitGasUsed.mul(commitReceipt!.effectiveGasPrice)
    const registerNetFee = registerGasUsed.mul(registerReceipt!.effectiveGasPrice)
    const totalNetFee = registerNetFee ? commitNetFee?.add(registerNetFee) : BigNumber.from(0)

    return (
      <Invoice
        items={[
          { label: t('invoice.registration'), value },
          { label: t('invoice.networkFee'), value: totalNetFee },
        ]}
        totalLabel={t('invoice.totalPaid')}
      />
    )
  }, [isLoading, registerData?.value, commitReceipt, registerReceipt, t])

  if (isMoonpayFlow) return { InvoiceFilled: null, avatarSrc }

  return { InvoiceFilled, avatarSrc }
}

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (toProfile: boolean) => void
  isMoonpayFlow: boolean
}

const Complete = ({ nameDetails: { normalisedName: name }, callback, isMoonpayFlow }: Props) => {
  const { t } = useTranslation('register')
  const { width, height } = useWindowSize()
  const { InvoiceFilled, avatarSrc } = useEthInvoice(name, isMoonpayFlow)

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
      <NFTContainer>
        <NFTTemplate backgroundImage={avatarSrc} isNormalised name={name} />
      </NFTContainer>
      <TitleContainer>
        <Title>{t('steps.complete.heading')}</Title>
        <SubtitleWithGradient>
          {t('steps.complete.subheading')}
          <b>{name}</b>
        </SubtitleWithGradient>
      </TitleContainer>
      <Typography>{t('steps.complete.description')}</Typography>
      {InvoiceFilled}
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
