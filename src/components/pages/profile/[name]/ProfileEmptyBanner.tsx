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
    margin-top: ${theme.space['4']};
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: ${theme.space['6']};
    padding: ${theme.space['6']};
    width: 100%;
    border: 4px solid ${theme.colors.background};
    border-radius: 16px;
    background: linear-gradient(${theme.colors.greenLight} 100%, ${theme.colors.greenSurface} 100%);

    @media (max-width: ${theme.breakpoints.sm}px) {
      grid-template-columns: 1fr;
      text-align: center;
      gap: ${theme.space['4']};
      padding: ${theme.space['4']};
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
      <div>
        <StarsSVG />
      </div>
      <div>
        <Typography fontVariant="large" weight="bold" color="text">
          {t('banner.empty.title')}
        </Typography>
        <Typography color="text" fontVariant="body">
          {t('banner.empty.description')}
        </Typography>
      </div>
      <Button width="auto" colorStyle="orangePrimary" onClick={() => action?.onClick()}>
        {t('banner.empty.action')}
      </Button>
    </Container>
  )
}
