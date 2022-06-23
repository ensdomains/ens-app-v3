import { Avatar, Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'

const Container = styled.div(
  ({ theme }) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 20px;
    border-radius: ${theme.space['4']};
    border: 1px solid ${theme.colors.borderTertiary};
    box-shadow: ${theme.boxShadows['0.02']};
    background: ${theme.colors.white};
    padding: ${theme.space['5']};
  `,
)

const AvatarContainer = styled.div(
  ({ theme }) => css`
    flex: 0 0 ${theme.space['13']};
  `,
)

const ProfileContent = styled.div(
  () => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
)

const ProfileTitle = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: ${theme.lineHeights['1.25']};
    margin-bottom: ${theme.space['1.5']};
  `,
)

const NoProfileSnippet = () => {
  const { t } = useTranslation('address')
  return (
    <Container data-testid="no-profile-snippet">
      <AvatarContainer>
        <Avatar label="profile-label" />
      </AvatarContainer>
      <ProfileContent>
        <ProfileTitle>{t('noProfile.title')}</ProfileTitle>
        <Typography variant="small" color="text">
          {t('noProfile.message')}
        </Typography>
      </ProfileContent>
    </Container>
  )
}

export default NoProfileSnippet
