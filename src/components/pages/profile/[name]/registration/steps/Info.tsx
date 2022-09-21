import styled, { css } from 'styled-components'

import { Button, Heading, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'

import FullInvoice from '../FullInvoice'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.md.min(css`
      flex-direction: row;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.grey};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.background};
      background: ${theme.colors.accent};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
const infoItems = [
  'Complete a transaction to begin the timer',
  'Wait 60 seconds for the timer to complete',
  'Complete a third transaction to secure your name',
]

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
}

const Info = ({ registrationData, nameDetails: { priceData }, callback }: Props) => {
  const estimate = useEstimateFullRegistration({ registration: registrationData, price: priceData })

  return (
    <StyledCard>
      <Heading>Before we start</Heading>
      <Typography>Registering your name takes three steps</Typography>
      <InfoItems>
        {infoItems.map((item, inx) => (
          <InfoItem key={item}>
            <Typography>{inx + 1}</Typography>
            <Typography>{item}</Typography>
          </InfoItem>
        ))}
      </InfoItems>
      <FullInvoice {...estimate} />
      <ButtonContainer>
        <MobileFullWidth>
          <Button shadowless variant="secondary" onClick={() => callback({ back: true })}>
            Back
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button shadowless onClick={() => callback({ back: false })}>
            Begin
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Info
