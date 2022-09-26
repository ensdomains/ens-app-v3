import { useTranslation } from 'react-i18next'
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

const ProfileButton = styled.button(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: bold;
    cursor: pointer;
  `,
)

const infoItemArr = Array.from({ length: 3 }, (_, i) => `steps.info.items.${i}`)

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
  onProfileClick: () => void
}

const Info = ({
  registrationData,
  nameDetails: { priceData },
  callback,
  onProfileClick,
}: Props) => {
  const { t } = useTranslation('register')

  const estimate = useEstimateFullRegistration({ registration: registrationData, price: priceData })

  return (
    <StyledCard>
      <Heading>{t('steps.info.heading')}</Heading>
      <Typography>{t('steps.info.subheading')}</Typography>
      <InfoItems>
        {infoItemArr.map((item, inx) => (
          <InfoItem key={item}>
            <Typography>{inx + 1}</Typography>
            <Typography>{t(item)}</Typography>
          </InfoItem>
        ))}
      </InfoItems>
      <FullInvoice {...estimate} />
      {!registrationData.queue.includes('profile') && (
        <ProfileButton onClick={onProfileClick}>
          <Typography>{t('steps.info.setupProfile')}</Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        <MobileFullWidth>
          <Button shadowless variant="secondary" onClick={() => callback({ back: true })}>
            {t('action.back', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button shadowless onClick={() => callback({ back: false })}>
            {t('action.begin', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Info
