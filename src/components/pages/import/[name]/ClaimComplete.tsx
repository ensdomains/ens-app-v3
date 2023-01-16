import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useTranslation } from 'react-i18next'
import useWindowSize from 'react-use/lib/useWindowSize'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import NFTTemplate from '@app/components/@molecules/NFTTemplate/NFTTemplate'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

import { ButtonContainer, CheckButton } from './shared'

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

const Container = styled.div`
  text-align: center;
`

const FunkyTypography = styled(Typography)`
  /* stylelint-disable */
  background: linear-gradient(330.4deg, #44bcf0 4.54%, #7298f8 59.2%, #a099ff 148.85%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const DomainTextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${mq.sm.min(css`
      gap: ${theme.space['2']};
      flex-direction: row;
    `)}
  `,
)

const NFTTemplateContainer = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;
    width: 240px;
    margin: 0 auto;
  `,
)

export const ClaimComplete = ({ name }: { name: string }) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('dnssec')

  // Removing from local storage so that success page is not shown twice.
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
        {name && <NFTTemplate backgroundImage={undefined} name={name} isNormalised />}
      </NFTTemplateContainer>
      <Spacer $height="5" />
      <Typography {...{ weight: 'bold', variant: 'extraLarge' }}>
        {t('claimComplete.title')}
      </Typography>{' '}
      <DomainTextContainer>
        <Typography {...{ weight: 'bold', variant: 'large' }}>
          {t('claimComplete.ownerOf')}
        </Typography>
        <FunkyTypography {...{ weight: 'bold', variant: 'large' }}>{name}</FunkyTypography>
      </DomainTextContainer>
      <Spacer $height="4" />
      <Typography>{t('claimComplete.successMessage')}</Typography>
      <Spacer $height="5" />
      <ButtonContainer>
        <CheckButton
          variant="primary"
          size="small"
          onClick={() => {
            router.push(`/profile/${name}`)
          }}
        >
          {t('claimComplete.viewName')}
        </CheckButton>
        <CheckButton
          variant="primary"
          size="small"
          onClick={() => {
            router.push(`/`)
          }}
        >
          {t('claimComplete.claimAnother')}
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
