import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import NFTTemplate from '@app/components/@molecules/NFTTemplate'

import { ButtonContainer, CheckButton } from './shared'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

const Confetti = () => {
  const { width, height } = useWindowSize()
  const [hide, setHide] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setHide(true)
    }, 5000)
  }, [])

  return <ReactConfetti width={width} height={height} numberOfPieces={hide ? 0 : 200} />
}

const FunkyTypography = styled(Typography)(
  ({ theme }) => css`
    background: linear-gradient(330.4deg, #44bcf0 4.54%, #7298f8 59.2%, #a099ff 148.85%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `,
)

const DomainTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${mq.sm.min(css`
    gap: 8px;
    flex-direction: row;
  `)}
`

const NFTTemplateContainer = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii['2xLarge']};
    width: 240px;
    margin: 0 auto;
  `,
)

export const ClaimComplete = ({ currentStep }) => {
  const router = useRouter()

  const name = router.query.name as string

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem('latestImportTransactionKey')
    }, 2000)
    return () => {
      localStorage.removeItem('latestImportTransactionKey')
    }
  }, [])

  return (
    <Container>
      <Confetti />
      <NFTTemplateContainer>
        {name && <NFTTemplate name={name} isNormalised />}
      </NFTTemplateContainer>
      <Spacer $height={5} />
      <Typography {...{ weight: 'bold', variant: 'extraLarge' }}>Congratulations!</Typography>{' '}
      <DomainTextContainer>
        <Typography {...{ weight: 'bold', variant: 'large' }}>You are now the owner of:</Typography>
        <FunkyTypography {...{ weight: 'bold', variant: 'large' }}>{name}</FunkyTypography>
      </DomainTextContainer>
      <Spacer $height={4} />
      <Typography {...{}}>
        Your domain name was successfully imported into ENS. You can now view and manage your name.
      </Typography>
      <Spacer $height={5} />
      <ButtonContainer>
        <CheckButton
          variant="primary"
          size="small"
          onClick={() => {
            router.push(`/profile/${name}`)
          }}
        >
          View name
        </CheckButton>
        <CheckButton
          variant="primary"
          size="small"
          onClick={() => {
            router.push(`/`)
          }}
        >
          Claim another
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
