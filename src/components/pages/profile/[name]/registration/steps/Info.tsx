import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Heading, Typography } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useEstimateFullRegistration } from '@app/hooks/gasEstimation/useEstimateRegistration'

import FullInvoice from '../FullInvoice'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
  `,
)

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      align-items: stretch;
    }
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
    border: 1px solid ${theme.colors.border};
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
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
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
  () => css`
    cursor: pointer;
  `,
)

const infoItemArr = Array.from({ length: 3 }, (_, i) => `steps.info.ethItems.${i}`)

type Props = {
  registrationData: RegistrationReducerDataItem
  name: string
  callback: (data: { back: boolean }) => void
  onProfileClick: () => void
}

const Info = ({ registrationData, name, callback, onProfileClick }: Props) => {
  const { t } = useTranslation('register')

  const estimate = useEstimateFullRegistration({
    name,
    registrationData,
  })

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
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography weight="bold" color="accent">
            {t('steps.info.setupProfile')}
          </Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={() => callback({ back: true })}>
            {t('action.back', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="next-button" onClick={() => callback({ back: false })}>
            {t('action.begin', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Info
