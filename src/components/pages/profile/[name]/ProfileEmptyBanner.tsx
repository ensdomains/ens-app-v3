import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import StarsSVG from '@app/assets/Stars.svg'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useProfileActions } from '@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions'
import { useProfile } from '@app/hooks/useProfile'

import { profileToProfileRecords } from './registration/steps/Profile/profileRecordUtils'

const Container = styled.div(
  ({ theme }) => css`
    --gradient-color-1: #6a07a0;
    --gradient-color-2: #100018;

    margin-top: ${theme.space['4']};
    display: grid;
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${theme.space['6']};
    padding: ${theme.space['6']};
    width: 100%;
    border: 4px solid ${theme.colors.background};
    border-radius: 16px;
    background: linear-gradient(
      166deg,
      var(--gradient-color-1) 6.85%,
      var(--gradient-color-2) 70.01%
    );
    color: ${theme.colors.white};

    @media (min-width: ${theme.breakpoints.sm}px) {
      background: linear-gradient(
        91deg,
        var(--gradient-color-1) 0.74%,
        var(--gradient-color-2) 75%
      );
      grid-template-columns: 48px 1fr auto;
      align-items: center;
      text-align: left;
    }
  `,
)

const StarsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: -${theme.space['2']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-bottom: 0;
    }
  `,
)

const GradientButton = styled(Button)(
  ({ theme }) => css`
    @property --gradient-btn-opacity {
      syntax: '<number>';
      inherits: false;
      initial-value: 0.15;
    }

    @property --gradient-hover-opacity {
      syntax: '<number>';
      inherits: false;
      initial-value: 0;
    }

    @property --gradient-angle {
      syntax: '<angle>';
      inherits: false;
      initial-value: 0deg;
    }

    @property --conic-gradient-opacity {
      syntax: '<number>';
      inherits: false;
      initial-value: 0.75;
    }

    --background-hover-opacity: 0;
    --background-gradient: radial-gradient(
        150% 125% at var(--x) var(--y),
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, var(--gradient-hover-opacity)) 200%
      ),
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(255, 255, 255, var(--gradient-btn-opacity)) 160.42%
      ),
      linear-gradient(
        95deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(255, 255, 255, var(--gradient-btn-opacity)) 124.96%
      ),
      rgba(0, 0, 0, 1);

    border-radius: var(--border-radii-large, 8px);
    background: var(--background-gradient);
    width: 100%;
    border: none;
    transform-style: preserve-3d;
    transition:
      --gradient-btn-opacity 0.15s ease-in-out,
      transform 0.1s ease-in-out,
      --gradient-hover-opacity 0.15s ease-in-out;

    @keyframes rotateGradient {
      0% {
        --gradient-angle: 0deg;
      }
      100% {
        --gradient-angle: 360deg;
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      width: calc(100% + 10px);
      height: calc(100% + 10px);
      background: conic-gradient(
        from var(--gradient-angle) at 50% 50%,
        var(--blue-bright, rgba(86, 154, 255, var(--conic-gradient-opacity))) 51.42deg,
        var(--purple-primary, rgba(163, 67, 211, var(--conic-gradient-opacity))) 102.84deg,
        var(--pink-primary, rgba(213, 46, 126, var(--conic-gradient-opacity))) 154.26deg,
        var(--red-primary, rgba(198, 48, 27, var(--conic-gradient-opacity))) 205.68deg,
        var(--orange-primary, rgba(243, 147, 11, var(--conic-gradient-opacity))) 257.1deg,
        var(--green-primary, rgba(25, 156, 117, var(--conic-gradient-opacity))) 308.52deg
      );
      filter: blur(12px);
      transform: translateZ(-2px);
      animation: rotateGradient 5s linear infinite;
      transition:
        --conic-gradient-opacity 0.15s ease-in-out,
        filter 0.15s ease-in-out;
    }

    &::after {
      content: '';
      position: absolute;
      top: -1.5px;
      left: -1.5px;
      width: calc(100% + 3px);
      height: calc(100% + 3px);
      background: linear-gradient(163deg, #181818 -1.89%, #545454 52.55%, #2a2a2a 116.46%);
      border-radius: 10px;
      transform: translateZ(-1px);
    }

    &:hover {
      &::before {
        filter: blur(14px);

        --conic-gradient-opacity: 0.9;
      }

      --gradient-btn-opacity: 0.2;
      --gradient-hover-opacity: 0.2;
      border: none;
      background: var(--background-gradient);
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      width: ${theme.space['36']};
    }
  `,
)

export function ProfileEmptyBanner({ name }: { name: string }) {
  const { t } = useTranslation('profile')

  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })
  const existingRecords = profileToProfileRecords(profile)
  const profileActions = useProfileActions({
    name,
  })
  const abilities = useAbilities({ name })
  const canEditRecords = abilities.data?.canEditRecords
  const records = existingRecords.filter(({ value }) => value)

  const action = (profileActions.profileActions ?? []).find(
    (i) => i.label === t('tabs.profile.actions.editProfile.label'),
  )

  if (records.length || isProfileLoading || !action || !canEditRecords) return null

  return (
    <Container data-testid="profile-empty-banner">
      <StarsContainer>
        <StarsSVG />
      </StarsContainer>
      <div>
        <Typography fontVariant="large" weight="bold" color="textAccent">
          {t('banner.empty.title')}
        </Typography>
        <Typography color="textAccent" fontVariant="body">
          {t('banner.empty.description')}
        </Typography>
      </div>
      <GradientButton
        width="auto"
        colorStyle="transparent"
        onClick={() => action?.onClick()}
        style={
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '--x': '0px',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '--y': '0px',
          } as React.CSSProperties
        }
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect()
          if (!box) return
          const x = e.clientX - box.left
          const y = e.clientY - box.top

          e.currentTarget.style.setProperty('--x', `${x}px`)
          e.currentTarget.style.setProperty('--y', `${y}px`)
        }}
      >
        {t('banner.empty.action')}
      </GradientButton>
    </Container>
  )
}
