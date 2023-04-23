import styled, { css } from 'styled-components'

import { Avatar, Typography } from '@ensdomains/thorin'

import { useAvatarFromRecord } from '@app/hooks/useAvatarFromRecord'
import { useProfile } from '@app/hooks/useProfile'
import { useZorb } from '@app/hooks/useZorb'
import { ReturnedENS } from '@app/types'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii['2xLarge']};
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    flex: 0 0 ${theme.space['20']};
    width: ${theme.space['20']};
    height: ${theme.space['20']};
    border-radius: ${theme.radii.full};
    overflow: hidden;
  `,
)

const InfoContainer = styled.div(
  () => css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  name: string
  resolver: string
}

const getTextRecordByKey = (profile: ReturnedENS['getProfile'], key: string) => {
  return profile?.records?.texts?.find(
    ({ key: recordKey }: { key: string | number }) => recordKey === key,
  )?.value
}

export const ProfileBlurb = ({ name, resolver }: Props) => {
  const { profile } = useProfile(name, !name, resolver)
  const avatarRecord = getTextRecordByKey(profile, 'avatar')
  const { avatar } = useAvatarFromRecord(avatarRecord)
  const zorb = useZorb(name, 'name')

  const nickname = getTextRecordByKey(profile, 'name')
  const description = getTextRecordByKey(profile, 'description')
  const url = getTextRecordByKey(profile, 'url')

  return (
    <Container>
      <AvatarWrapper>
        <Avatar label="profile-button-avatar" src={avatar || zorb} noBorder />
      </AvatarWrapper>
      <InfoContainer>
        <Typography fontVariant="extraLargeBold">{name}</Typography>
        {nickname && <Typography color="grey">{nickname}</Typography>}
        {description && <Typography ellipsis>{description}</Typography>}
        {url && (
          <Typography fontVariant="bodyBold" color="blue">
            {url}
          </Typography>
        )}
      </InfoContainer>
    </Container>
  )
}
