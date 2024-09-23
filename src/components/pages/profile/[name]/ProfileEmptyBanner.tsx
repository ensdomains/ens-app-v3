import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, mq, Typography } from '@ensdomains/thorin'

import StarsSVG from '@app/assets/Stars.svg'
import { useProfileActions } from '@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions'
import { useProfile } from '@app/hooks/useProfile'

import { profileToProfileRecords } from '../../register/steps/Profile/profileRecordUtils'

const Container = styled.div(
  ({ theme }) => css`
    margin-top: ${theme.space['4']};
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: ${theme.space['6']};
    padding: ${theme.space['6']};
    width: 100%;
    border: 4px solid #fff;
    border-radius: 16px;
    background: linear-gradient(#e7f4ef 100%, #fdf0dd 100%);

    ${mq.sm.max(css`
      grid-template-columns: 1fr;
      text-align: center;
      gap: ${theme.space['4']};
      padding: ${theme.space['4']};
    `)}
  `,
)

export function ProfileEmptyBanner({ name }: { name: string }) {
  const { t } = useTranslation('profile')

  const { data: profile, isLoading: isProfileLoading } = useProfile({ name })
  const existingRecords = profileToProfileRecords(profile)
  const profileActions = useProfileActions({
    name,
  })

  const records = existingRecords.filter(({ value }) => value)

  const action = (profileActions.profileActions ?? []).find(
    (i) => i.label === t('tabs.profile.actions.editProfile.label'),
  )

  if (records.length || isProfileLoading || !action) return null

  return (
    <Container data-testid="profile-empty-banner">
      <div>
        <StarsSVG />
      </div>
      <div>
        <Typography fontVariant="large" weight="bold" color="textPrimary">
          {t('banner.empty.title')}
        </Typography>
        <Typography color="textPrimary" fontVariant="body">
          {t('banner.empty.description')}
        </Typography>
      </div>
      <Button width="auto" colorStyle="orangePrimary" onClick={() => action?.onClick()}>
        {t('banner.empty.action')}
      </Button>
    </Container>
  )
}
