import dynamic from 'next/dynamic'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import type ConfettiT from 'react-confetti'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { decodeEventLog } from 'viem'
import { useTransactionReceipt } from 'wagmi'

import { tokenise } from '@ensdomains/ensjs/utils'
import { Button, mq, Typography } from '@ensdomains/thorin'

import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import NFTTemplate from '@app/components/@molecules/NFTTemplate/NFTTemplate'
import { Card } from '@app/components/Card'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionManager } from '@app/transaction/transactionManager'

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
    display: inline;

    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;

    background-image: ${theme.colors.gradients.blue};
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

const nameRegisteredSnippet = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        name: 'label',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        name: 'baseCost',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'premium',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'expires',
        type: 'uint256',
      },
    ],
    name: 'NameRegistered',
    type: 'event',
  },
] as const

const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

const useEthInvoice = (
  name: string,
  isMoonpayFlow: boolean,
): { InvoiceFilled?: React.ReactNode; avatarSrc?: string } => {
  const { t } = useTranslation('register')

  const commitTransaction = useTransactionManager((s) => s.getCurrentCommitTransaction(name))
  const registerTransaction = useTransactionManager((s) => s.getCurrentRegisterTransaction(name))

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()

  const { data: commitReceipt } = useTransactionReceipt({
    hash: commitTransaction?.currentHash ?? undefined,
  })
  const { data: registerReceipt } = useTransactionReceipt({
    hash: registerTransaction?.currentHash ?? undefined,
  })

  const registrationValue = useMemo(() => {
    if (!registerReceipt) return null
    for (const log of registerReceipt.logs) {
      try {
        const {
          args: { baseCost, premium },
        } = decodeEventLog({
          abi: nameRegisteredSnippet,
          topics: log.topics,
          data: log.data,
          eventName: 'NameRegistered',
        })
        return baseCost + premium
        // eslint-disable-next-line no-empty
      } catch {}
    }
    return null
  }, [registerReceipt])

  const isLoading = !commitReceipt || !registerReceipt

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

    return (
      <Invoice
        items={[
          { label: t('invoice.registration'), value },
          { label: t('invoice.networkFee'), value: totalNetFee },
        ]}
        totalLabel={t('invoice.totalPaid')}
      />
    )
  }, [isLoading, registrationValue, commitReceipt, registerReceipt, t])

  if (isMoonpayFlow) return { InvoiceFilled: null, avatarSrc }

  return { InvoiceFilled, avatarSrc }
}

type Props = {
  name: string
  beautifiedName: string
}

const Complete = ({ name, beautifiedName }: Props) => {
  const { t } = useTranslation('register')
  const { width, height } = useWindowSize()

  const router = useRouterWithHistory()

  const paymentMethod = useTransactionManager(
    (s) => s.getCurrentRegistrationFlowOrDefault(name).paymentMethodChoice,
  )

  const onComplete = (toProfile: boolean) => {
    router.push(toProfile ? `/profile/${name}` : '/')
  }

  const { InvoiceFilled, avatarSrc } = useEthInvoice(name, paymentMethod === 'moonpay')

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
      <NFTContainer>
        <NFTTemplate backgroundImage={avatarSrc} isNormalised name={name} />
      </NFTContainer>
      <TitleContainer>
        <Title>{t('steps.complete.heading')}</Title>
        <Typography style={{ display: 'inline' }} fontVariant="headingThree" weight="bold">
          {t('steps.complete.subheading')}
          <SubtitleWithGradient>{nameWithColourEmojis}</SubtitleWithGradient>
        </Typography>
      </TitleContainer>
      <Typography>{t('steps.complete.description')}</Typography>
      {InvoiceFilled}
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={() => onComplete(false)}>
            {t('steps.complete.registerAnother')}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="view-name" onClick={() => onComplete(true)}>
            {t('steps.complete.viewName')}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Complete
