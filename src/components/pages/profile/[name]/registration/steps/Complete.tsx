import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import type ConfettiT from 'react-confetti'
import styled, { css } from 'styled-components'
import { useAccount, useWaitForTransaction } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import NFTTemplate from '@app/components/@molecules/NFTTemplate'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useTransactionResponseReceipt from '@app/hooks/useTransactionResponseReceipt'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    canvas {
      max-width: ${theme.space.full};
    }

    ${mq.md.min(css`
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

    ${mq.md.min(css`
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
    line-height: ${theme.lineHeights.normal};
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

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (toProfile: boolean) => void
}

const Complete = ({ nameDetails: { normalisedName: name }, callback }: Props) => {
  const { width, height } = useWindowSize()

  const { address } = useAccount()
  const keySuffix = `${name}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction } = useTransactionFlow()

  const commitTxFlow = getLatestTransaction(commitKey)
  const registerTxFlow = getLatestTransaction(registerKey)

  const { data: commitReceipt, isLoading: commitLoading } = useWaitForTransaction({
    hash: commitTxFlow!.hash,
  })
  const {
    response: registerResponse,
    receipt: registerReceipt,
    isLoading: registerLoading,
  } = useTransactionResponseReceipt(registerTxFlow!.hash!)
  const isLoading = commitLoading || registerLoading

  const InvoiceFilled = useMemo(() => {
    if (isLoading) return null
    const { value } = registerResponse!
    const commitNetFee = commitReceipt!.gasUsed.mul(commitReceipt!.effectiveGasPrice)
    const registerNetFee = registerReceipt!.gasUsed.mul(registerReceipt!.effectiveGasPrice)
    const totalNetFee = commitNetFee.add(registerNetFee)

    return (
      <Invoice
        items={[
          { label: 'Registration', value },
          { label: 'Network fee', value: totalNetFee },
        ]}
        totalLabel="Total Paid"
      />
    )
  }, [registerResponse, commitReceipt, registerReceipt, isLoading])

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
        <NFTTemplate backgroundImage={undefined} isNormalised name={name} />
      </NFTContainer>
      <TitleContainer>
        <Title>Congratulations!</Title>
        <SubtitleWithGradient>
          You are now the owner of <b>{name}</b>
        </SubtitleWithGradient>
      </TitleContainer>
      <Typography>
        Your name was successfully registered. You can now view and manage your name.
      </Typography>
      {InvoiceFilled}
      <ButtonContainer>
        <MobileFullWidth>
          <Button shadowless variant="secondary" onClick={() => callback(false)}>
            Register another
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button shadowless onClick={() => callback(true)}>
            View name
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Complete
